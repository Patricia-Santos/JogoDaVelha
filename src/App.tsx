import { useState, useEffect } from 'react';
import './App.css';

type Players = "O" | "X";

function App() {

  const [turn, setTurn] = useState<Players>("X");
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
    setTurn(prev => prev == "X" ? "O" : "X");
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
      <h1>JOGO DA VELHA</h1>

      <p>O jogo iniciará com o jogador "X". Já nas rodadas seguintes a partida terá início com o último vencedor. O jogo funciona da seguinte forma: aquele que enfileirar em sequência (seja na vertical, horizontal ou diagonal) três marcas suas, vence.</p>

      {winner && <h2>Jogador "{winner}" ganhou</h2>}
      {draw && <h2>Empate</h2>}

      {!gameOver && <h2> Vez do jogador "{turn}" </h2>}

      <div className={`board ${gameOver ? "gameOver" : null}`}>
        {getSquares().map((_, i) => (
          <div className={`cell ${getCellPlayer(i)}`} onClick={() => play(i)}>
            {marks[i]}
          </div>
        ))}
      </div>
      {gameOver && <button onClick={reset}>Reiniciar</button>}
    </div>
  )
}

export default App