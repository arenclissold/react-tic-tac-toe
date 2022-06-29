import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { GrPowerReset } from 'react-icons/gr';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {
          [...Array(3).keys()].map((row) => {
            return (
              <div className="board-row" key={row}>
                {
                  [...Array(3).keys()].map((col) => {
                    const i = (row * 3) + col
                    return (this.renderSquare(i))
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      reverseMoves: false
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    console.log(squares)
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  reset() {
    this.setState({
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    })
  }

  reverse() {
    this.setState({reverseMoves: !this.state.reverseMoves })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history


    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      if (this.state.reverseMoves) move = Math.abs(move - history.length + 1)
      const isActive = move === this.state.stepNumber ? 'active' : ''
      return (
        <li key={move}>
            <button className={isActive} onClick={() => this.jumpTo(move)}>{move}</button>
        </li>
      )
    })

    const ResetButton = () => {
      return (
        <button className='bg-red-400 rounded-3xl h-11 w-11 flex items-center justify-center' onClick={() => this.reset()}><GrPowerReset size='30' /></button>
      )
    }

    const ReverseButton = () => {
      return (
        <button className='font-bold bg-blue-300 px-2 py-2 rounded my-4' onClick={() => this.reverse()}>Reverse Moves</button>
      )
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }


    return (
      <div className='flex flex-col items-center'>
        <div className='flex items-center'><h2 className='text-center bg-blue-300 text-lg rounded px-3 py-2 m-3'>{status}</h2><ResetButton /></div>

        <div className="game">
          <div className="game-board">
            <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <ReverseButton />
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Game />);
