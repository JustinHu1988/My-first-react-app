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

class TimeCount extends React.Component{
  constructor(props){
    super(props);
    this.state = {time: 0};
  }
  componentDidMount(){
    this.timerID = setInterval(()=>this.tick(), 1000);
  }
  componentWillUnmount(){
    clearInterval(this.timerID);
  }
  tick(){
    this.setState({time: this.state.time+1});
  }
  render(){
    return(
        <div className="time-count">
        {this.props.side}累计用时: {Math.floor(this.state.time/60)}分 {this.state.time%60}秒.
        </div>
    );
  }
}

class GoBoard extends React.Component {
  renderCell(i) {
    return (<Cell value={this.props.cells[i]} key={i} onClick={() => this.props.onClick(i)}/>);
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
            <ul className="go-row" key={i}>
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
          cells: Array(255).fill(null),
          myArr:[]
      }],
      stepNumber: 0,
      xIsNext: true,
      numOrder:[]
    };
  }

  moveDown(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let num= [];
    for(let i = 0; i<15; i++){
      for(let j=0; j<15; j++){
        num.push([i+1,j+1]);
      }
    }

    if(decideWinner(current.myArr)||current.cells[i]){
      return;
    }
    const cells = current.cells.slice();
    cells[i] = this.state.xIsNext ? <img src={blackPiece} alt="black" /> : <img src={whitePiece} alt="black"/>;

      let myArr = current.myArr.slice();
      myArr = myArr.concat([num[i]]);

    let numOrder = this.state.numOrder.slice(0, this.state.stepNumber + 1);

    this.setState({
      history: history.concat([{cells:cells, myArr:myArr}]),
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
    const winner = decideWinner(current.myArr);
    

    const moves = history.map((step, move) => {
      const desc = move ? (move%2!==0 ? '黑方' : '白方') +' [' + this.state.numOrder[move-1] + ']'  : '游戏开始';
      return(
        <li key={move}>
          <a href="#0" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if(winner){
      status = winner+'获胜';
    }else{
      status = (this.state.xIsNext ? '黑方' : '白方') + '请落子';
    }

    return (
      <div className="gobang-game">
        <div className="gobang-board">
          <GoBoard cells={current.cells} onClick={(i) => this.moveDown(i)}/>
        </div>
        <div className="game-info">
          <div className="play-order">{status}</div>
          <ol className="play-his">
            <h3>历史记录</h3>
            {moves}
          </ol>
              <TimeCount side='比赛' />
              <div className='description'>说明：此APP旨在练习React框架，可以实现双人下五子棋，并添加了一点canvas效果</div>
        </div>

      </div>
    );
  }
}

function decideWinner (cells){
  let len = cells.length;
  let lastMove = cells[len-1];
  let newArr = [];
  let whichSide="";
  if(len%2!==0){
    for(let i=0; i<len; i+=2){
      if(cells[i] !== undefined){
          newArr.push(cells[i]);
      }
    }
    whichSide = "黑方";
  }else{
    for(let i=1; i<len; i+=2){
        if(cells[i] !== undefined){
            newArr.push(cells[i]);
        }
    }
    whichSide = "白方";
  }
  let newLen = newArr.length;
  let line1 = [], line2 =[], line3=[], line4=[];

  if(newLen>=4){
      for(let i=0; i<newLen; i++){
        if(lastMove[0]===newArr[i][0] && Math.abs(lastMove[1] - newArr[i][1]) < 5){
          line1.push(newArr[i][1]);
        }
        if(lastMove[1]===newArr[i][1] && Math.abs(lastMove[0] - newArr[i][0]) < 5){
            line2.push(newArr[i][0]);
        }
        if(lastMove[0]-lastMove[1] === newArr[i][0] - newArr[i][1] && Math.abs(lastMove[0] - newArr[i][0]) < 5){
          line3.push(newArr[i][0]);
        }
        if(lastMove[0]+lastMove[1] === newArr[i][0] + newArr[i][1] && Math.abs(lastMove[0] - newArr[i][0]) < 5){
          line4.push(newArr[i][0]);
        }
      }
      let mainLines = [line1, line2, line3, line4];

      let finalArr = mainLines.map((line) => {
          if(line.length>=5){
              let count=0;
              line.sort((a,b)=> a-b);
              for(let i=0; i<line.length; i++){
                  if(line[i+1]-line[i] === 1){
                      count++;
                      if(count===4){
                          return whichSide;
                      }
                  }else{
                      count=0;
                  }
              }
          }
      });

      if(finalArr.find((whic) => {return whic === whichSide})){
        return whichSide;
      }
  }

  return null;
}


// canvas这部分的写法有待优化，目前没有融入react
(function() {
    let canvasNav = document.getElementById("canvas-snow");
    let navW = window.innerWidth;
    let navH = window.innerHeight;
    navW = canvasNav.width = window.innerWidth;
    navH = canvasNav.height = window.innerHeight;
    let cNavCon = canvasNav.getContext("2d");
    cNavCon.fillStyle = "#040e19";
    cNavCon.fillRect(0, 0, navW, navH);
    cNavCon.save();
    let octagons = [];

    class Octagon {
        constructor(radius, wNum, hNum) {
            this.radius = radius;
            this.terminalpointsOrigin = [];
            this.wNum = wNum;
            this.hNum = hNum;
            this.num = 1;
            this.pointsOri();
        }

        draw() {
            for (let i = 0; i < this.wNum; i++) {
                for (let j = 0; j < this.hNum; j++) {
                    cNavCon.save();
                    // cNavCon.translate(cPoint.x,cPoint.y);
                    if (this.terminalpointsOrigin[i][j].x > navW) {
                        this.terminalpointsOrigin[i][j].x = 0;
                    } else if (this.terminalpointsOrigin[i][j].y > navH) {
                        this.terminalpointsOrigin[i][j].y = 0;
                    } else {
                    }
                    cNavCon.translate(this.terminalpointsOrigin[i][j].x += this.terminalpointsOrigin[i][j].speed / 20, this.terminalpointsOrigin[i][j].y += this.terminalpointsOrigin[i][j].speed / 20);
                    cNavCon.beginPath();
                    cNavCon.arc(0, 0, this.terminalpointsOrigin[i][j].radius, 0, Math.PI * 2, false);
                    cNavCon.closePath();
                    cNavCon.fillStyle = "#474747";
                    cNavCon.fill();
                    cNavCon.restore();
                }

            }

            cNavCon.closePath();
        }

        pointsOri() {
            for (let i = 0; i < this.wNum; i++) {
                this.terminalpointsOrigin[i] = [];
                for (let j = 0; j < this.hNum; j++) {
                    let arc = (Math.PI / 4) * (i + 1);
                    this.terminalpointsOrigin[i][j] = {
                        x: (i / this.wNum) * navW + Math.floor(Math.random() * 50 + 5),
                        y: (j / this.hNum) * navH + Math.floor(Math.random() * 50 + 5),
                        speed: Math.floor(Math.random() * 10 + 5),
                        radius: Math.floor(Math.random() * 10 + 5) / 5
                    };
                }
            }
        }
    }
    let thissnow = new Octagon(20, 20, 20);
    thissnow.draw();
    let drawSnowRe;

    function mainDrawSnow() {
        drawSnowRe = window.requestAnimationFrame(mainDrawSnow);
        cNavCon.clearRect(0, 0, navW, navH);
        cNavCon.fillRect(0, 0, navW, navH);
        thissnow.draw();
    };
    mainDrawSnow();

    window.onresize=function(){
        navW = canvasNav.width = window.innerWidth;
        navH = canvasNav.height = window.innerHeight;
        thissnow.pointsOri();
    }

})();







// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
