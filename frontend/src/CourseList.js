import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from './config';
// Asegúrate de importar CourseCard si lo tienes en un archivo separado
// import CourseCard from './CourseCard'; 
import './App.css'; 

function CourseList() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cursos/`)
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
    <div>
      <div className="hero-section">
        <h1>Bienvenido a Apuntate</h1>
        <p>Repasa, aprende y domina tus temas con cuestionarios interactivos.</p>
      </div>
      <div className="course-list-container"> 
        <h1>Tus Apuntes Disponibles</h1>
      <div className="course-grid">
        {cursos.map(curso => (
          <div key={curso.id} className="course-card">
            {/* Si tienes una imagen de curso, puedes usarla aquí */}
            {curso.imagen_url ? (
                <img src={curso.imagen_url} alt={curso.titulo} 
                     onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x180/3b8d99/ffffff?text=Apuntes"; }}/>
            ) : (
                <div className="course-image-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60px" height="60px">
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                    </svg>
                    <span>Apuntes</span>
                </div>
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
    </div>
  );
}

export default CourseList;
