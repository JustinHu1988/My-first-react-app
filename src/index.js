import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import blackPiece from './images/black-piece.png';
import whitePiece from './images/white-piece.png';


function Cell(props) {
    return (
      <li className="cell" onClick={props.onClick}>
        {props.value}
      </li>
    );
}

class GoBoard extends React.Component {
  renderCell(i) {
    return (<Cell value={this.props.squares[i]} key={i} onClick={() => this.props.onClick(i)}/>);
  }

  render() {
    let renderItem = ()=>{
      let keyCount1 =0;
      let renderList = ()=>{
        let list = [];
        for(let i=0; i<15; i++){
            list.push(this.renderCell(keyCount1));
            keyCount1++;
          }
          return list;
      }
      let BoardList = ()=>{
        let list = [];
        for(let i=0; i<15; i++){
            list.push(
            <ul className="board-row" key={i}>
              {renderList()}
            </ul>
            );
          }
          return list;
      }
      return (
          BoardList()
      )
    }
    
    return (
      <div>
        {renderItem()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history:[{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      numOrder:[]
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const num= [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]];

    if(calculateWinner(current.squares)||current.squares[i]){
      return;
    }
    const squares = current.squares.slice();
    squares[i] = this.state.xIsNext ? <img src={blackPiece} alt="black" /> : <img src={whitePiece} alt="black"/>;
    let numOrder = this.state.numOrder.slice(0, this.state.stepNumber + 1);
    this.setState({
      history: history.concat([{squares:squares}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      numOrder: numOrder.concat([num[i]])
    });
  }


  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: step %2 ? false : true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #(' + this.state.numOrder[move-1] + ')'  : 'Game start';
      return(
        <li key={move}>
          <a href="#0" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="gobang-game">
        <div className="gobang-board">
          <GoBoard squares={current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner (squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i=0; i<lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a]===squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
