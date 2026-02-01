import React from 'react';
import './App.css';

function Flashcard({ palabra, significado, isFlipped, onClick }) {
  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={onClick}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          {/* Muestra la palabra si es una tarjeta de palabra */}
          {palabra && <h3>{palabra}</h3>}
          {/* Muestra un icono o un texto genérico si no es de palabra (es significado) */}
          {!palabra && <h3>?</h3>} {/* Puedes poner un icono aquí si lo deseas */}
        </div>
        <div className="flashcard-back">
          {/* Muestra el significado si es una tarjeta de significado */}
          {significado && <p>{significado}</p>}
          {/* Muestra la palabra si es una tarjeta de palabra (cuando está volteada) */}
          {!significado && <p>{palabra}</p>}
        </div>
      </div>
    </div>
  );
}

export default Flashcard;