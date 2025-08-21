import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

function CourseList() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ¡CAMBIA ESTA URL a la de tu backend en Render!
    fetch('https://cursos-django-backend.onrender.com/api/cursos/') 
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
    <div className="course-list-container"> 
      <h1>Nuestros Cursos Disponibles</h1>
      <div className="course-grid">
        {cursos.map(curso => (
          <div key={curso.id} className="course-card">
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
