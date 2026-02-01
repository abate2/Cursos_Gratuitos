import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de importar CourseCard si lo tienes en un archivo separado
// import CourseCard from './CourseCard'; 
import './App.css'; 

function CourseList() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/cursos/')
      .then(response => response.json())
      .then(data => {
        setCursos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando cursos...</p>;
  }

  return (
    // ¡Aquí se asegura que este div tenga la clase 'course-list-container'!
    <div className="course-list-container"> 
      <h1>Nuestros Cursos Disponibles</h1>
      <div className="course-grid">
        {cursos.map(curso => (
          <div key={curso.id} className="course-card">
            {/* Si tienes una imagen de curso, puedes usarla aquí */}
            {curso.imagen_url ? (
                <img src={curso.imagen_url} alt={curso.titulo} 
                     onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x180/E0E0E0/808080?text=Curso"; }}/>
            ) : (
                <img src="https://placehold.co/400x180/E0E0E0/808080?text=Curso" alt="Placeholder de Curso"/>
            )}
            <div className="course-card-content">
              <h2>{curso.titulo}</h2>
              <p>{curso.descripcion}</p>
              <Link to={`/cursos/${curso.id}`}>Ver Curso</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
