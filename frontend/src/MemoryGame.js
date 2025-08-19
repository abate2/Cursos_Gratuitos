import React, { useState, useEffect, useCallback } from 'react';
import Flashcard from './Flashcard';
import './App.css'; // Asegúrate de que los estilos se apliquen

function MemoryGame() {
  // allRawFlashcards: Guarda los datos brutos de las flashcards que vienen de la API.
  const [allRawFlashcards, setAllRawFlashcards] = useState([]); 
  // displayFlashcards: Son las tarjetas que realmente se muestran en el juego (pares de palabra/significado).
  const [displayFlashcards, setDisplayFlashcards] = useState([]); 
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // fetchRawFlashcards: Función para obtener las flashcards del backend.
  // Usamos useCallback para que esta función no cambie en cada render y se pueda usar en useEffect.
  const fetchRawFlashcards = useCallback(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/flashcards/`) // Obtiene TODAS las flashcards
      .then(response => response.json())
      .then(data => {
        setAllRawFlashcards(data); // Almacena los datos brutos
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching all flashcards:", error);
        setLoading(false);
      });
  }, []); // El array de dependencias vacío significa que esta función solo se crea una vez.

  // useEffect para cargar las flashcards brutos cuando el componente se monta.
  useEffect(() => {
    fetchRawFlashcards();
  }, [fetchRawFlashcards]); // Se ejecuta cuando fetchRawFlashcards cambia (en este caso, solo una vez).

  // prepareAndShuffleCards: Prepara los pares de tarjetas y las baraja para el juego.
  const prepareAndShuffleCards = useCallback((rawCards) => {
    // Si no hay suficientes flashcards (mínimo 1 para crear un par), advertir y no continuar.
    if (rawCards.length < 1) { 
        console.warn("No hay suficientes flashcards para jugar. Necesitas al menos 1.");
        setDisplayFlashcards([]);
        return;
    }
    // Crea los pares de tarjetas (una para la palabra y otra para el significado)
    const initialCards = rawCards.flatMap(card => [
      { id: card.id + '-word', type: 'word', content: card.palabra, pairId: card.id },
      { id: card.id + '-meaning', type: 'meaning', content: card.significado, pairId: card.id }
    ]);
    // Baraja las tarjetas y las establece en el estado para mostrarlas.
    setDisplayFlashcards(shuffleArray(initialCards));
    setFlippedCards([]); // Reinicia las tarjetas volteadas
    setMatchedCards([]); // Reinicia las tarjetas emparejadas
  }, []); // El array de dependencias vacío significa que esta función solo se crea una vez.


  // useEffect para preparar y barajar las tarjetas una vez que los datos brutos están disponibles
  // o cuando se quiere reiniciar el juego (cambia gameStarted)
  useEffect(() => {
    // Solo prepara las tarjetas si ya tenemos los datos brutos y si el juego aún no ha empezado
    // (o si se está reiniciando y necesitamos nuevas tarjetas)
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

  // startGame: Función para iniciar el juego cuando el usuario hace clic en el botón.
  const startGame = () => {
    setGameStarted(true); // Pone el estado del juego a 'iniciado'
    prepareAndShuffleCards(allRawFlashcards); // Prepara y baraja las tarjetas para el juego
  };

  // allCardsMatched: Comprueba si todas las tarjetas han sido emparejadas.
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
