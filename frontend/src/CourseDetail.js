import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function CourseDetail() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  // 1. Añade un nuevo estado para la lección seleccionada.
  const [leccionActual, setLeccionActual] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/cursos/${id}/`)
      .then(response => response.json())
      .then(data => {
        setCurso(data);
        // 2. Por defecto, selecciona la primera lección cuando se carguen los datos.
        if (data.lecciones.length > 0) {
          setLeccionActual(data.lecciones[0]);
        }
      });
  }, [id]);

  // 3. Función para manejar el clic en una lección de la lista.
  const handleLeccionClick = (leccion) => {
    setLeccionActual(leccion);
  };

  // 4. Función para pasar a la siguiente lección.
  const handleNextLeccion = () => {
    const currentIndex = curso.lecciones.findIndex(
      (leccion) => leccion.id === leccionActual.id
    );
    if (currentIndex < curso.lecciones.length - 1) {
      setLeccionActual(curso.lecciones[currentIndex + 1]);
    }
  };

  // 5. Función para volver a la lección anterior.
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
        {/* 6. El panel de la izquierda muestra la lista de lecciones */}
        <div className="lecciones-list">
          <h2>Contenido del curso</h2>
          <ul>
            {curso.lecciones.map((leccion) => (
              <li
                key={leccion.id}
                onClick={() => handleLeccionClick(leccion)}
                // Aplica una clase 'active' a la lección seleccionada
                className={leccion.id === leccionActual?.id ? 'active' : ''}
              >
                {leccion.titulo}
              </li>
            ))}
          </ul>
        </div>
        {/* 7. El panel de la derecha muestra el contenido de la lección */}
        <div className="leccion-content">
          {leccionActual ? (
            <div>
              <h3>{leccionActual.titulo}</h3>
              <p>{leccionActual.contenido_texto}</p>
              <div className="leccion-buttons">
                {/* Botón para la lección anterior */}
                <button
                  onClick={handlePrevLeccion}
                  disabled={leccionActual.id === curso.lecciones[0].id}
                >
                  Lección Anterior
                </button>
                {/* Botón para la siguiente lección */}
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