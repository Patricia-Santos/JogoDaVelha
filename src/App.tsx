import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

type Players = "O" | "X";

function App() {

  const [turn, setTurn] = useState<string>("X");
  const [winner, setWinner] = useState<Players | null >(null);
  const [draw, setDraw] = useState<boolean | null>(null);
  const [marks, setMarks] = useState<{[key: string]: Players}>({});
  const gameOver = !!winner || !!draw;


  const getSquares = () => {
    return new Array(9).fill(true);
  }

  const play = (index: number) => {

    if(marks[index] || gameOver){
      return;
    }

    setMarks(prev => ({...prev, [index]: turn}));
    setTurn(prev => prev == "O" ? "X" : "O");
  }

  const getCellPlayer = (index: number) => {
    if (!marks[index]){
      return;
    }

    return marks[index];
  }

  const getWinner = () => {
    const victoryLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8]
    ]

    for(const line of victoryLines){
      const [a, b, c] = line;

      if(marks[a] && marks[a] === marks[b] && marks[a] == marks[c]){
        return marks[a];
      }
    }
  }

  const reset = () => {
    if(winner === "X"){
      setTurn("X")
    }
    else{
      setTurn("O")
    }
    setMarks({});
    setWinner(null);
    setDraw(null);
  }

  useEffect(() => {
    const winner = getWinner();

    if(winner){
      setWinner(winner);
    }
    else {
      if(Object.keys(marks).length === 9){
        setDraw(true);
      }
    }
  })

  return (
    <div className="container">
      {winner && <h1>Jogador "{winner}" ganhou</h1>}
      {draw && <h1>Empate</h1>}

      {gameOver && <button onClick={reset}>Iniciar</button>}
      {!gameOver && <p> Vez do jogador "{turn}" </p>}

      <div className={`board ${gameOver ? "gameOver" : null}`}>
        {getSquares().map((_, i) => (
          <div className={`cell ${getCellPlayer(i)}`} onClick={() => play(i)}>
            {marks[i]}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App