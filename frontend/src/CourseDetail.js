// frontend/src/CourseDetail.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'; // Para sanitizar HTML
import './CourseDetail.css'; // Asegúrate de que este CSS exista
import MemoryGame from './MemoryGame'; // Importa el componente del juego de memoria

function CourseDetail() {
    const { id } = useParams(); // Obtiene el ID del curso de la URL
    const courseId = parseInt(id); // Convierte el ID a número entero
    const navigate = useNavigate(); // Para la navegación programática

    const [course, setCourse] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false); // Estado para controlar si el quiz ha iniciado
    const [showMemoryGame, setShowMemoryGame] = useState(false); // Estado para mostrar el juego de memoria

    // URL base de tu API de Django (¡Actualizar con la URL de Railway cuando esté lista!)
    // const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Para desarrollo local
    const API_BASE_URL = 'https://TU_URL_DE_RAILWAY_BACKEND.up.railway.app/api'; // ¡ACTUALIZA ESTA LÍNEA CON TU URL REAL DE RAILWAY!

    // Función para obtener los detalles del curso
    const fetchCourseDetail = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cursos/${courseId}/`);
            if (!response.ok) {
                if (response.status === 404) {
                    navigate('/not-found'); // Redirige si el curso no se encuentra
                    return;
                }
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setCourse(data);
        } catch (error) {
            console.error("Error al cargar los detalles del curso:", error);
            // Podrías mostrar un mensaje de error al usuario
        }
    }, [courseId, navigate]); // Dependencias del useCallback

    // Función para obtener las preguntas del quiz
    const fetchQuizQuestions = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cursos/${courseId}/preguntas_quiz/`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setQuizQuestions(data);
            // Inicializa las respuestas del usuario vacías
            const initialAnswers = {};
            data.forEach(q => {
                if (q.tipo_pregunta === 'multiple_choice' || q.tipo_pregunta === 'true_false') {
                    initialAnswers[q.id] = null; // Para preguntas de opción múltiple y V/F
                } else if (q.tipo_pregunta === 'fill_in_the_blank') {
                    initialAnswers[q.id] = ''; // Para rellenar espacios
                }
            });
            setUserAnswers(initialAnswers);
            setQuizStarted(false); // Reinicia el estado del quiz al cargar nuevas preguntas
            setScore(0);
            setShowScore(false);
        } catch (error) {
            console.error("Error al cargar las preguntas del quiz:", error);
        }
    }, [courseId]); // Dependencias del useCallback

    // useEffect para cargar los detalles del curso y las preguntas del quiz
    useEffect(() => {
        fetchCourseDetail();
        fetchQuizQuestions(); // Llama a la función para obtener las preguntas del quiz
    }, [courseId, fetchCourseDetail, fetchQuizQuestions]); // <-- ¡Aquí se añadió fetchQuizQuestions!

    // Maneja el cambio de respuestas para preguntas de opción múltiple y V/F
    const handleAnswerChange = (questionId, selectedOptionId) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedOptionId
        }));
    };

    // Maneja el cambio de respuestas para rellenar espacios
    const handleFillInTheBlankChange = (questionId, value) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: value
        }));
    };

    // Evalúa el quiz
    const handleSubmitQuiz = () => {
        let currentScore = 0;
        quizQuestions.forEach(q => {
            if (q.tipo_pregunta === 'multiple_choice' || q.tipo_pregunta === 'true_false') {
                // Compara la opción seleccionada con la opción correcta
                const selectedOption = userAnswers[q.id];
                const correctOption = q.opciones.find(opt => opt.es_correcta);
                if (selectedOption === correctOption?.id) {
                    currentScore += 1;
                }
            } else if (q.tipo_pregunta === 'fill_in_the_blank') {
                // Compara la respuesta escrita con la respuesta esperada (sensible a mayúsculas/minúsculas)
                if (userAnswers[q.id]?.toLowerCase().trim() === q.respuesta_esperada?.toLowerCase().trim()) {
                    currentScore += 1;
                }
            }
        });
        setScore(currentScore);
        setShowScore(true);
    };

    // Inicia el quiz
    const startQuiz = () => {
        setQuizStarted(true);
        // Reinicializa las respuestas al iniciar el quiz
        const initialAnswers = {};
        quizQuestions.forEach(q => {
            if (q.tipo_pregunta === 'multiple_choice' || q.tipo_pregunta === 'true_false') {
                initialAnswers[q.id] = null;
            } else if (q.tipo_pregunta === 'fill_in_the_blank') {
                initialAnswers[q.id] = '';
            }
        });
        setUserAnswers(initialAnswers);
        setScore(0);
        setShowScore(false);
    };

    // Si el curso aún no se ha cargado, muestra un mensaje de carga
    if (!course) {
        return <div className="loading-message">Cargando detalles del curso...</div>;
    }

    return (
        <div className="course-detail-container">
            <button onClick={() => navigate(-1)} className="back-button">
                &larr; Volver a Cursos
            </button>
            <h1 className="course-title">{course.titulo}</h1>
            <p className="course-category">Categoría: {course.categoria}</p>
            <img src={course.imagen_portada} alt={course.titulo} className="course-cover-image" />

            <div className="course-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(course.descripcion) }} />

            {/* Sección de Recursos */}
            {course.recursos && course.recursos.length > 0 && (
                <div className="course-resources">
                    <h2>Recursos Adicionales</h2>
                    <ul>
                        {course.recursos.map((recurso, index) => (
                            <li key={index}>
                                <a href={recurso.url} target="_blank" rel="noopener noreferrer">{recurso.nombre}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sección del Quiz */}
            {quizQuestions.length > 0 && (
                <div className="quiz-section">
                    <h2>Quiz del Curso</h2>
                    {!quizStarted ? (
                        <button onClick={startQuiz} className="start-quiz-button">Iniciar Quiz</button>
                    ) : (
                        <>
                            {quizQuestions.map((q, index) => (
                                <div key={q.id} className="quiz-question-card">
                                    <p className="question-number">Pregunta {index + 1}:</p>
                                    <p className="question-text">{q.texto_pregunta}</p>
                                    {q.tipo_pregunta === 'multiple_choice' && (
                                        <div className="options-container">
                                            {q.opciones.map(option => (
                                                <label key={option.id} className="option-label">
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        value={option.id}
                                                        checked={userAnswers[q.id] === option.id}
                                                        onChange={() => handleAnswerChange(q.id, option.id)}
                                                    />
                                                    {option.texto_opcion}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {q.tipo_pregunta === 'true_false' && (
                                        <div className="options-container">
                                            <label className="option-label">
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    value={true}
                                                    checked={userAnswers[q.id] === true}
                                                    onChange={() => handleAnswerChange(q.id, true)}
                                                />
                                                Verdadero
                                            </label>
                                            <label className="option-label">
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    value={false}
                                                    checked={userAnswers[q.id] === false}
                                                    onChange={() => handleAnswerChange(q.id, false)}
                                                />
                                                Falso
                                            </label>
                                        </div>
                                    )}
                                    {q.tipo_pregunta === 'fill_in_the_blank' && (
                                        <input
                                            type="text"
                                            className="fill-in-the-blank-input"
                                            value={userAnswers[q.id] || ''}
                                            onChange={(e) => handleFillInTheBlankChange(q.id, e.target.value)}
                                            placeholder="Escribe tu respuesta aquí"
                                        />
                                    )}
                                </div>
                            ))}
                            <button onClick={handleSubmitQuiz} className="submit-quiz-button">Enviar Quiz</button>

                            {showScore && (
                                <div className="quiz-results">
                                    <h3>Tu Puntuación: {score} de {quizQuestions.length}</h3>
                                    {score === quizQuestions.length ? (
                                        <p className="quiz-passed">¡Felicidades! Has aprobado el quiz.</p>
                                    ) : (
                                        <p className="quiz-failed">Sigue practicando, puedes mejorar.</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Sección del Juego de Memoria */}
            <div className="memory-game-toggle-section">
                <button onClick={() => setShowMemoryGame(!showMemoryGame)} className="toggle-game-button">
                    {showMemoryGame ? 'Ocultar Juego de Memoria' : 'Mostrar Juego de Memoria'}
                </button>
                {showMemoryGame && (
                    <div className="memory-game-container">
                        <h2>Juego de Memoria</h2>
                        {/* Puedes pasarle props al juego de memoria si es necesario, como las palabras del curso */}
                        <MemoryGame courseId={courseId} API_BASE_URL={API_BASE_URL} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseDetail;
