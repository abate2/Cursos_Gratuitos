import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function CourseDetail() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [leccionActual, setLeccionActual] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/cursos/${id}/`)
      .then(response => response.json())
      .then(data => {
        setCurso(data);
        if (data.lecciones.length > 0) {
          setLeccionActual(data.lecciones[0]);
        }
      });
  }, [id]);

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
              <p>{leccionActual.contenido_texto}</p>
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