import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // <-- ¡Importa Link!
import Flashcard from './Flashcard';
import './App.css'; // Asegúrate de que los estilos se apliquen

function MemoryGame() {
  const [allRawFlashcards, setAllRawFlashcards] = useState([]); 
  const [displayFlashcards, setDisplayFlashcards] = useState([]); 
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRawFlashcards = useCallback(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/flashcards/`) 
      .then(response => response.json())
      .then(data => {
        setAllRawFlashcards(data); 
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching all flashcards:", error);
        setLoading(false);
      });
  }, []); 

  useEffect(() => {
    fetchRawFlashcards();
  }, [fetchRawFlashcards]); 

  const prepareAndShuffleCards = useCallback((rawCards) => {
    if (rawCards.length < 1) { 
        console.warn("No hay flashcards para jugar en este momento. Por favor, añade al menos una en el panel de administración.");
        setDisplayFlashcards([]);
        return;
    }

    const shuffledRawCards = shuffleArray(rawCards);
    const cardsToUseForGame = shuffledRawCards.slice(0, 6); 

    if (cardsToUseForGame.length < 1) { 
        console.warn("No hay flashcards suficientes para el juego después de la selección. Necesitas al menos 1.");
        setDisplayFlashcards([]);
        return;
    }

    const initialCards = cardsToUseForGame.flatMap(card => [
      { id: card.id + '-word', type: 'word', content: card.palabra, pairId: card.id },
      { id: card.id + '-meaning', type: 'meaning', content: card.significado, pairId: card.id }
    ]);
    
    setDisplayFlashcards(shuffleArray(initialCards));
    setFlippedCards([]); 
    setMatchedCards([]); 
  }, []); 

  useEffect(() => {
    if (allRawFlashcards.length > 0 && !gameStarted) { 
      prepareAndShuffleCards(allRawFlashcards);
    }
  }, [allRawFlashcards, gameStarted, prepareAndShuffleCards]); 

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
      const firstCard = displayFlashcards.find(card => card.id === firstCardId);

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

  const startGame = () => {
    setGameStarted(true); 
    prepareAndShuffleCards(allRawFlashcards); 
  };

  const refreshVocabulary = () => {
    setGameStarted(false); 
    setFlippedCards([]);
    setMatchedCards([]);
    fetchRawFlashcards(); 
  };

  const allCardsMatched = displayFlashcards.length > 0 && matchedCards.length === displayFlashcards.length;

  if (loading) {
    return <p>Cargando tarjetas del juego...</p>;
  }

  return (
    <div className="memory-game-container">
      <h2>Juego de Memorizar Vocabulario</h2>
      {displayFlashcards.length > 0 ? (
        <>
          {!gameStarted && (
            <div className="game-controls">
              <button onClick={startGame}>Iniciar Juego</button>
              <button onClick={refreshVocabulary} className="secondary-button">Actualizar Vocabulario</button>
              <Link to="/"> {/* <-- ¡Nuevo botón para regresar a la página principal! */}
                <button className="tertiary-button">Volver a Cursos</button>
              </Link>
            </div>
          )}

          {gameStarted && (
            <div className="flashcards-grid">
              {displayFlashcards.map(card => (
                <Flashcard
                  key={card.id}
                  palabra={card.type === 'word' ? card.content : null}
                  significado={card.type === 'meaning' ? card.content : null}
                  isFlipped={flippedCards.includes(card.id) || matchedCards.includes(card.id)}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>
          )}

          {gameStarted && allCardsMatched && (
            <div className="game-controls">
              <p>¡Felicidades! Has emparejado todas las tarjetas.</p>
              <button onClick={startGame}>Volver a Jugar</button>
              <button onClick={refreshVocabulary} className="secondary-button">Actualizar Vocabulario</button>
              <Link to="/"> {/* <-- ¡También aquí para cuando se termina el juego! */}
                <button className="tertiary-button">Volver a Cursos</button>
              </Link>
            </div>
          )}
        </>
      ) : (
        <p>No hay flashcards disponibles para jugar. Por favor, añade algunas en el panel de administración.</p>
      )}
    </div>
  );
}

export default MemoryGame;
