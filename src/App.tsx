import { useState, useEffect } from 'react';
import './App.css';

type Players = "O" | "X";
type Marks = { [key: number]: Players };

function App() {
  const [turn, setTurn] = useState<Players>("X");
  const [winner, setWinner] = useState<Players | null>(null);
  const [draw, setDraw] = useState<boolean | null>(null);
  const [marks, setMarks] = useState<Marks>({});
  const gameOver = !!winner || !!draw;

  const victoryLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const getSquares = () => new Array(9).fill(true);

  const play = (index: number) => {
    if (marks[index] || gameOver || turn === "O") return;
    setMarks(prev => ({ ...prev, [index]: "X" }));
    setTurn("O");
  };

  const getCellPlayer = (index: number) => marks[index];

  const getWinner = (checkMarks: Marks) => {
    for (const line of victoryLines) {
      const [a, b, c] = line;
      if (checkMarks[a] && checkMarks[a] === checkMarks[b] && checkMarks[a] === checkMarks[c]) {
        return checkMarks[a];
      }
    }
    return null;
  };

  const checkWinnerMinimax = (checkMarks: Marks): Players | "draw" | null => {
    const winner = getWinner(checkMarks);
    if (winner) return winner;
    if (Object.values(checkMarks).filter(mark => mark !== undefined).length === 9) return "draw";
    return null;
  };

  // Minimax AI
  const minimax = (newMarks: Marks, depth: number, isMaximizing: boolean): number => {
    const result = checkWinnerMinimax(newMarks);
    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    if (result === "draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newMarks[i]) {
          const updatedMarks: Marks = { ...newMarks, [i]: "O" as Players };

          const score = minimax(updatedMarks, depth + 1, false);
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newMarks[i]) {
          const updatedMarks = { ...newMarks, [i]: "X" as Players };
          const score = minimax(updatedMarks, depth + 1, true);
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const botPlay = () => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (!marks[i]) {
        const updatedMarks = { ...marks, [i]: "O" as Players };
        const score = minimax(updatedMarks, 0, false);
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    if (move !== -1) {
      setMarks(prev => ({ ...prev, [move]: "O" }));
      setTurn("X");
    }
  };

  const reset = () => {
    setTurn(winner === "X" ? "X" : "O");
    setMarks({});
    setWinner(null);
    setDraw(null);
  };

  useEffect(() => {
    const currentWinner = getWinner(marks);
    if (currentWinner) {
      setWinner(currentWinner);
      return;
    }

    if (Object.values(marks).filter(mark => mark !== undefined).length === 9) {
      setDraw(true);
      return;
    }

    if (turn === "O" && !gameOver) {
      const botTimer = setTimeout(() => {
        botPlay();
      }, 500);
      return () => clearTimeout(botTimer);
    }
  }, [marks, turn]);

  return (
    <div className="container">
      <h1>JOGO DA VELHA</h1>
      <p>Aquele que enfileirar três marcas vence. X é o jogador e O é a IA.</p>

      {winner && <h2>Jogador "{winner}" ganhou</h2>}
      {draw && <h2>Empate</h2>}
      {!gameOver && <h2>Vez do jogador "{turn}"</h2>}

      <div className={`board ${gameOver ? "gameOver" : ""}`}>
        {getSquares().map((_, i) => (
          <div
            key={i}
            className={`cell ${getCellPlayer(i)}`}
            onClick={() => play(i)}
          >
            {marks[i]}
          </div>
        ))}
      </div>
      {gameOver && <button onClick={reset}>Reiniciar</button>}
    </div>
  );
}

export default App;
