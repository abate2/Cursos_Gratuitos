// frontend/src/MemoryGame.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Flashcard from './Flashcard';
import './App.css';

function MemoryGame() {
  // URL base de tu API de Django en Render
  const API_BASE_URL = 'https://cursos-django-backend.onrender.com/api'; // ¡USA ESTA URL!

  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlashcards = useCallback(() => {
    setLoading(true);
    // Ahora llama a la ruta de todas las flashcards
    fetch(`${API_BASE_URL}/flashcards/`) 
      .then(response => response.json())
      .then(data => {
        if (data.length < 3) { // Necesitas al menos 3 flashcards para 6 tarjetas (3 pares)
          console.warn("No hay suficientes flashcards para jugar. Necesitas al menos 3.");
          setFlashcards([]);
          setLoading(false);
          return;
        }

        // Tomar un número par de flashcards para el juego, por ejemplo, 6 flashcards (12 tarjetas)
        const selectedFlashcards = data.slice(0, 6); 

        // Crear pares de tarjetas (palabra y significado)
        const initialCards = selectedFlashcards.flatMap(card => [
          { id: card.id + '-word', type: 'word', content: card.palabra, pairId: card.id },
          { id: card.id + '-meaning', type: 'meaning', content: card.significado, pairId: card.id }
        ]);

        setFlashcards(shuffleArray(initialCards));
        setFlippedCards([]);
        setMatchedCards([]);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching flashcards:", error);
        setLoading(false);
        setFlashcards([]); // Limpiar flashcards si hay un error
      });
  }, [API_BASE_URL]); // Agregamos API_BASE_URL a las dependencias

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || matchedCards.includes(clickedCard.id)) {
      return;
    }

    setFlippedCards(prev => [...prev, clickedCard.id]);

    if (flippedCards.length === 1) {
      const firstCardId = flippedCards[0];
      const firstCard = flashcards.find(card => card.id === firstCardId);

      if (firstCard.pairId === clickedCard.pairId && firstCard.id !== clickedCard.id) {
        setMatchedCards(prev => [...prev, firstCard.id, clickedCard.id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    fetchFlashcards(); // Vuelve a cargar y barajar las tarjetas
  };

  const allCardsMatched = flashcards.length > 0 && matchedCards.length === flashcards.length;

  if (loading) {
    return <p className="memory-game-container">Cargando juego...</p>;
  }

  return (
    <div className="memory-game-container">
      <h2>Juego de Memorizar Vocabulario</h2>
      {flashcards.length === 0 ? (
        <p>No hay suficientes flashcards disponibles para iniciar el juego.</p>
      ) : (
        <>
          <div className="flashcards-grid">
            {flashcards.map(card => (
              <Flashcard
                key={card.id}
                palabra={card.type === 'word' ? card.content : null}
                significado={card.type === 'meaning' ? card.content : null}
                isFlipped={flippedCards.includes(card.id) || matchedCards.includes(card.id)}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>

          <div className="game-controls">
            {allCardsMatched ? (
              <p>¡Felicidades! Has emparejado todas las tarjetas.</p>
            ) : (
              <p>Voltea las tarjetas y encuentra los pares.</p>
            )}
            <button onClick={resetGame}>Volver a Jugar</button>
            <Link to="/">
              <button className="secondary-button">Volver a Cursos</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default MemoryGame;
