import React, { useState, useEffect, useCallback } from 'react'; // Agregamos useCallback
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css'; // Asegúrate de que los estilos se apliquen

function CourseDetail() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);
  const [showActivities, setShowActivities] = useState(false); 

  // --- Nuevos estados para el Mini-Cuestionario ---
  const [quizQuestions, setQuizQuestions] = useState([]); // Todas las preguntas del quiz para la lección
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Índice de la pregunta actual
  const [userAnswers, setUserAnswers] = useState({}); // Respuestas del usuario {questionId: optionId}
  const [showQuizResults, setShowQuizResults] = useState(false); // Para mostrar los resultados al final
  const [quizStarted, setQuizStarted] = useState(false); // Para controlar si el quiz ha iniciado

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/cursos/${id}/`)
      .then(response => response.json())
      .then(data => {
        setCurso(data);
        if (data.lecciones.length > 0) {
          setLeccionActual(data.lecciones[0]); // Establece la primera lección por defecto
        }
      })
      .catch(error => console.error("Error fetching course:", error));
  }, [id]);

  // Cuando la lección actual cambia, colapsa las actividades y reinicia el quiz
  useEffect(() => {
    if (leccionActual) {
      setShowActivities(false); 
      setQuizStarted(false); // Reinicia el quiz al cambiar de lección
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowQuizResults(false);
      // Llama a la función para cargar las preguntas del quiz de la nueva lección
      fetchQuizQuestions(leccionActual.id); 
    }
  }, [leccionActual, fetchQuizQuestions]);

  // Función para obtener las preguntas del quiz de la API
  const fetchQuizQuestions = useCallback((leccionId) => {
    fetch(`http://127.0.0.1:8000/api/lecciones/${leccionId}/quiz_questions/`)
      .then(response => response.json())
      .then(data => {
        setQuizQuestions(data);
        console.log("Preguntas del quiz cargadas:", data); // Para depuración
      })
      .catch(error => console.error("Error fetching quiz questions:", error));
  }, []); // Dependencia vacía para que la función no cambie.

  const handleLeccionClick = (leccion) => {
    setLeccionActual(leccion);
  };

  const handleNextLeccion = () => {
    const currentIndex = curso.lecciones.findIndex(
      (leccion) => leccion.id === leccionActual.id
    );
    if (currentIndex < curso.lecciones.length - 1) {
      setLeccionActual(curso.lecciones[currentIndex + 1]);
    }
  };

  const handlePrevLeccion = () => {
    const currentIndex = curso.lecciones.findIndex(
      (leccion) => leccion.id === leccionActual.id
    );
    if (currentIndex > 0) {
      setLeccionActual(curso.lecciones[currentIndex - 1]);
    }
  };

  // --- Funciones para el Mini-Cuestionario ---
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowQuizResults(false);
  };

  const handleOptionSelect = (questionId, optionId) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowQuizResults(true); // Mostrar resultados al terminar
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowQuizResults(false);
    setQuizStarted(false); // Volver al estado inicial para que aparezca el botón "Iniciar Cuestionario"
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach(question => {
      const selectedOptionId = userAnswers[question.id];
      const correctOption = question.options.find(option => option.is_correct);
      if (selectedOptionId === correctOption?.id) {
        score += 1;
      }
    });
    return score;
  };

  if (!curso) {
    return <p>Cargando curso...</p>;
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="course-detail">
      <h1>{curso.titulo}</h1>
      <div className="lecciones-container">
        {/* Panel de menú de lecciones (izquierda) */}
        <div className="lecciones-list">
          <h2>Contenido del curso</h2>
          <ul>
            {curso.lecciones.map((leccion) => (
              <li
                key={leccion.id}
                onClick={() => handleLeccionClick(leccion)}
                className={leccion.id === leccionActual?.id ? 'active' : ''}
              >
                {leccion.titulo}
              </li>
            ))}
          </ul>
        </div>
        {/* Contenido de la lección (derecha) */}
        <div className="leccion-content">
          {leccionActual ? (
            <div>
              <h3>{leccionActual.titulo}</h3>
              {/* Contenido de la lección */}
              <div dangerouslySetInnerHTML={{ __html: leccionActual.contenido_texto }}></div>
              
              {/* Sección de Actividades */}
              <div className="activities-section">
                <h3 onClick={() => setShowActivities(!showActivities)} className="activities-toggle">
                  Actividades {showActivities ? '▲' : '▼'}
                </h3>

                {showActivities && (
                  <div className="activities-content">
                    {/* Botón para ir al juego de memorizar */}
                    <Link to="/juego-memorizar">
                        <button className="activity-button">Ir al Juego de Memorizar</button>
                    </Link>
                    {/* El enunciado "Aquí se incluirán otras actividades interactivas para esta lección en el futuro." ha sido removido. */}

                    {/* --- Mini-Cuestionario --- */}
                    <div className="mini-quiz-container">
                      {quizQuestions.length > 0 ? (
                        <>
                          {!quizStarted && ( // Mostrar botón de iniciar si el quiz no ha empezado
                            <button onClick={startQuiz} className="quiz-start-button">
                              Iniciar Mini-Cuestionario
                            </button>
                          )}

                          {quizStarted && !showQuizResults && currentQuestion && ( // Mostrar pregunta si el quiz ha iniciado y no hay resultados
                            <div className="quiz-question-card">
                              <h4>Pregunta {currentQuestionIndex + 1} de {quizQuestions.length}</h4>
                              <p className="question-text">{currentQuestion.question_text}</p>
                              <div className="quiz-options">
                                {currentQuestion.options.map(option => (
                                  <button
                                    key={option.id}
                                    className={`quiz-option-button 
                                      ${userAnswers[currentQuestion.id] === option.id ? 'selected' : ''}`}
                                    onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                                  >
                                    {option.option_text}
                                  </button>
                                ))}
                              </div>
                              <button 
                                className="quiz-navigation-button" 
                                onClick={goToNextQuestion}
                                disabled={!userAnswers[currentQuestion.id]} // Deshabilitar si no ha seleccionado opción
                              >
                                {currentQuestionIndex === quizQuestions.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
                              </button>
                            </div>
                          )}

                          {quizStarted && showQuizResults && ( // Mostrar resultados al finalizar
                            <div className="quiz-results-card">
                              <h4>Resultados del Cuestionario</h4>
                              <p>Has obtenido {calculateScore()} de {quizQuestions.length} respuestas correctas.</p>
                              <div className="review-answers">
                                {quizQuestions.map((question, index) => {
                                  const selectedOptionId = userAnswers[question.id];
                                  const correctOption = question.options.find(option => option.is_correct);
                                  const isCorrect = selectedOptionId === correctOption?.id;

                                  return (
                                    <div key={question.id} className={`answer-review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                      <p><strong>{index + 1}. {question.question_text}</strong></p>
                                      <p>Tu respuesta: {question.options.find(opt => opt.id === selectedOptionId)?.option_text || 'No respondido'}</p>
                                      <p>Respuesta correcta: {correctOption?.option_text}</p>
                                    </div>
                                  );
                                })}
                              </div>
                              <button onClick={retakeQuiz} className="quiz-retake-button">Volver a Intentar</button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p>No hay mini-cuestionarios disponibles para esta lección.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="leccion-buttons">
                {/* Botón para regresar a la página principal de cursos */}
                <Link to="/">
                    <button className="tertiary-button">Volver a Cursos</button>
                </Link>
                <button
                  onClick={handlePrevLeccion}
                  disabled={leccionActual.id === curso.lecciones[0].id}
                >
                  Lección Anterior
                </button>
                <button
                  onClick={handleNextLeccion}
                  disabled={leccionActual.id === curso.lecciones[curso.lecciones.length - 1].id}
                >
                  Siguiente Lección
                </button>
              </div>
            </div>
          ) : (
            <p>Selecciona una lección para comenzar.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
