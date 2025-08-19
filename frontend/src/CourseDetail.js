import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'; // <-- ¡Necesitamos Link para el botón de redirección!
// Ya no necesitamos importar Flashcard aquí, el juego se manejará en su propio componente.
// import Flashcard from './Flashcard'; 
import './App.css'; // Make sure styles are applied

function CourseDetail() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);
  const [showActivities, setShowActivities] = useState(false); // State to show/hide activities

  // Eliminamos todos los estados del juego de flashcards de aquí

  useEffect(() => {
    // Fetch course and lessons
    fetch(`http://127.0.0.1:8000/api/cursos/${id}/`)
      .then(response => response.json())
      .then(data => {
        setCurso(data);
        if (data.lecciones.length > 0) {
          setLeccionActual(data.lecciones[0]); // Set the first lesson by default
        }
      })
      .catch(error => console.error("Error fetching course:", error));
  }, [id]);

  // Cuando la lección actual cambia, puedes decidir si quieres que la sección de actividades se colapse.
  useEffect(() => {
    if (leccionActual) {
      setShowActivities(false); // Colapsa la sección de actividades al cambiar de lección
    }
  }, [leccionActual]);

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

  if (!curso) {
    return <p>Cargando curso...</p>;
  }

  return (
    <div className="course-detail">
      <h1>{curso.titulo}</h1>
      <div className="lecciones-container">
        {/* Lesson menu panel (left) */}
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
        {/* Lesson content (right) */}
        <div className="leccion-content">
          {leccionActual ? (
            <div>
              <h3>{leccionActual.titulo}</h3>
              {/* Lesson content */}
              <div dangerouslySetInnerHTML={{ __html: leccionActual.contenido_texto }}></div>
              
              {/* Activities Section */}
              <div className="activities-section">
                <h3 onClick={() => setShowActivities(!showActivities)} className="activities-toggle">
                  Actividades {showActivities ? '▲' : '▼'} {/* Expansion/collapse indicator */}
                </h3>

                {showActivities && (
                  <div className="activities-content">
                    {/* Botón que redirige a la sección del juego de memorizar */}
                    <Link to="/juego-memorizar">
                        <button className="activity-button">Ir al Juego de Memorizar</button>
                    </Link>
                    <p>Aquí se incluirán otras actividades interactivas específicas de esta lección en el futuro.</p>
                  </div>
                )}
              </div>

              <div className="leccion-buttons">
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
