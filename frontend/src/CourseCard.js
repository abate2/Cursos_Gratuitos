import React from 'react';

function CourseCard({ curso }) {
  return (
    <div className="course-card">
      <h2>{curso.titulo}</h2>
      <p>Instructor: {curso.instructor}</p>
      <p>{curso.descripcion_corta}</p>
    </div>
  );
}

export default CourseCard;