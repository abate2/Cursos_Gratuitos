import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import './App.css';

function CourseList() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/cursos/')
      .then(response => response.json())
      .then(data => setCursos(data));
  }, []);

  return (
    <div>
      <h1>Nuestros Cursos</h1>
      {cursos.length > 0 ? (
        <div className="courses-list">
          {cursos.map(curso => (
            <Link to={`/cursos/${curso.id}`} key={curso.id}>
              <CourseCard curso={curso} />
            </Link>
          ))}
        </div>
      ) : (
        <p>Cargando cursos...</p>
      )}
    </div>
  );
}

export default CourseList;