import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function CourseDetail() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/cursos/${id}/`)
      .then(response => response.json())
      .then(data => setCurso(data));
  }, [id]);

  if (!curso) {
    return <p>Cargando curso...</p>;
  }

  return (
    <div className="course-detail">
      <h1>{curso.titulo}</h1>
      <h2>Lecciones:</h2>
      <ul>
        {curso.lecciones.map(leccion => (
          <li key={leccion.id}>{leccion.titulo}</li>
        ))}
      </ul>
    </div>
  );
}

export default CourseDetail;