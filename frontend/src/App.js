import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseList from './CourseList';
import CourseDetail from './CourseDetail';
import MemoryGame from './MemoryGame'; // <-- ¡Importa el componente del juego de memoria!
import './App.css'; // Tus estilos generales

function App() {
  return (
    <Router>
      <div className="App">
        {/* La barra de navegación está vacía según tu solicitud */}
        <nav className="navbar">
        </nav>

        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/cursos/:id" element={<CourseDetail />} />
          <Route path="/juego-memorizar" element={<MemoryGame />} /> {/* <-- ¡La ruta del juego está de vuelta! */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
