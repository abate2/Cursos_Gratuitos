import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom'; // Agregamos Link aquí
import './App.css'; 

function CourseDetail() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);
  const [showActivities, setShowActivities] = useState(false); 

  // URL base de tu API de Django en Render
  const API_BASE_URL = 'https://cursos-django-backend.onrender.com/api'; // ¡USA ESTA URL!

  // --- Nuevos estados para el Mini-Cuestionario ---
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/cursos/${id}/`) // Usa la API_BASE_URL
      .then(response => response.json())
      .then(data => {
        setCurso(data);
        if (data.lecciones.length > 0) {
          setLeccionActual(data.lecciones[0]);
        }
      })
      .catch(error => console.error("Error fetching course:", error));
  }, [id, API_BASE_URL]); // Agregamos API_BASE_URL a las dependencias

  useEffect(() => {
    if (leccionActual) {
      setShowActivities(false); 
      setQuizStarted(false);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowQuizResults(false);
      fetchQuizQuestions(leccionActual.id); 
    }
  }, [leccionActual, fetchQuizQuestions]); // Agregamos fetchQuizQuestions a las dependencias

  const fetchQuizQuestions = useCallback((leccionId) => {
    fetch(`${API_BASE_URL}/lecciones/${leccionId}/quiz_questions/`) // Usa la API_BASE_URL
      .then(response => response.json())
      .then(data => {
        setQuizQuestions(data);
        console.log("Preguntas del quiz cargadas:", data);
      })
      .catch(error => console.error("Error fetching quiz questions:", error));
  }, [API_BASE_URL]); // Agregamos API_BASE_URL a las dependencias

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
      setShowQuizResults(true);
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowQuizResults(false);
    setQuizStarted(false);
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
        <div className="leccion-content">
          {leccionActual ? (
            <div>
              <h3>{leccionActual.titulo}</h3>
              <div dangerouslySetInnerHTML={{ __html: leccionActual.contenido_texto }}></div>
              
              <div className="activities-section">
                <h3 onClick={() => setShowActivities(!showActivities)} className="activities-toggle">
                  Actividades {showActivities ? '▲' : '▼'}
                </h3>

                {showActivities && (
                  <div className="activities-content">
                    <Link to="/juego-memorizar">
                        <button className="activity-button">Ir al Juego de Memorizar</button>
                    </Link>

                    <div className="mini-quiz-container">
                      {quizQuestions.length > 0 ? (
                        <>
                          {!quizStarted && (
                            <button onClick={startQuiz} className="quiz-start-button">
                              Iniciar Mini-Cuestionario
                            </button>
                          )}

                          {quizStarted && !showQuizResults && currentQuestion && (
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
                                disabled={!userAnswers[currentQuestion.id]}
                              >
                                {currentQuestionIndex === quizQuestions.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
                              </button>
                            </div>
                          )}

                          {quizStarted && showQuizResults && (
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
