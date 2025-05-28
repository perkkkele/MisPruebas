import React, { useState, useEffect, DragEvent } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

interface Phase {
  id: string;
  text: string;
  status: 'neutral' | 'correct' | 'incorrect' | 'revealed';
}

const PHASES = [
  'Problema','Investigación','Soluciones posibles','Planificación',
  'Diseño','Solución elegida','Construcción','Comprobación',
  'Presentación y evaluación','Memoria'
];

const CORRECT_ORDER = [
  'Problema','Investigación','Soluciones posibles','Solución elegida',
  'Diseño','Planificación','Construcción','Comprobación',
  'Presentación y evaluación','Memoria'
];

const MAX_ATTEMPTS = 3;

function App() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [gameEnded, setGameEnded] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => reset(), []);

  function shuffle<T>(arr: T[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function reset() {
    setAttempts(MAX_ATTEMPTS);
    setGameEnded(false);
    setMessage(null);
    setScore(null);
    const shuffled = shuffle(PHASES).map(text => ({ id: text, text, status: 'neutral' as const }));
    setPhases(shuffled);
  }

  function handleDragStart(e: DragEvent, id: string) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e: DragEvent, id: string) {
    e.preventDefault();
    if (!draggedId) return;
    const fromIdx = phases.findIndex(p => p.id === draggedId);
    const toIdx = phases.findIndex(p => p.id === id);
    const newPhases = [...phases];
    const [moved] = newPhases.splice(fromIdx, 1);
    newPhases.splice(toIdx, 0, moved);
    setPhases(newPhases.map(p => ({ ...p, status: 'neutral' })));  
    setDraggedId(null);
    setMessage(null);
    setScore(null);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function check() {
    if (gameEnded || attempts <= 0) return;
    let allCorrect = true;
    let correctCount = 0;
    const updated = phases.map((p, i) => {
      if (p.text === CORRECT_ORDER[i]) {
        correctCount++;
        return { ...p, status: 'correct' as const };
      }
      allCorrect = false;
      return { ...p, status: 'incorrect' as const };
    });
    setPhases(updated);
    setAttempts(a => a - 1);
    setScore(correctCount);
    const percent = Math.round((correctCount / CORRECT_ORDER.length) * 100);

    if (allCorrect) {
      setMessage({ text: `¡Felicidades! Has ordenado correctamente todas las fases. Calificación: ${percent}% (${correctCount}/${CORRECT_ORDER.length})`, type: 'success' });
      setGameEnded(true);
    } else if (attempts - 1 <= 0) {
      setMessage({ text: `Has agotado tus intentos. Calificación final: ${percent}% (${correctCount}/${CORRECT_ORDER.length}). Se revela el orden correcto.`, type: 'error' });
      reveal();
    } else {
      setMessage({ text: `Incorrecto. Tu calificación: ${percent}% (${correctCount}/${CORRECT_ORDER.length}). Te quedan ${attempts - 1} intento(s).`, type: 'info' });
    }
  }

  function reveal() {
    const revealed = CORRECT_ORDER.map(text => ({ id: text, text, status: 'revealed' as const }));
    setPhases(revealed);
    setGameEnded(true);
  }

  return (
    <div className="container">
      <h1>Ordena correctamente las distintas fases del método de proyectos.</h1>
      <ul className="phases-list">
        {phases.map((p, idx) => (
          <li
            key={p.id}
            className={`phase-item ${p.status}`}
            draggable={!gameEnded}
            onDragStart={e => handleDragStart(e, p.id)}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, p.id)}
          >
            {idx + 1}. {p.text}
          </li>
        ))}
      </ul>

      {message && (
        <div className={`feedback-message ${message.type}`}>{message.text}</div>
      )}

      <div className="controls">
        <button onClick={check} disabled={gameEnded || attempts <= 0} className="primary-button">
          Corregir
        </button>
        <button onClick={reset} className="secondary-button">
          Reiniciar ejercicio
        </button>
        <div className="attempts-info">
          Quedan <span className="attempts-count-bubble">{attempts}</span> intentos
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(<App />);
