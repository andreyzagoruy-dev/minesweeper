import React from 'react';
import Cell from './Cell';
import mouseImage from './mouse.svg';
import { is } from '@babel/types';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      markersLeft: props.mines,
      isGameOver: false,
      isWon: false,
      board: null
    }

    this.handleCellClick = this.handleCellClick.bind(this);
    this.openCell = this.openCell.bind(this);
  }

  componentDidMount() {
    this.startGame();
  }

  startGame() {
    const emptyBoard = this.generateBoard();
    const boardWithMines = this.placeMines(emptyBoard);
    const boardWithValues = this.setValues(boardWithMines);

    this.setState({
      board: boardWithValues
    });
  }

  generateBoard() {
    const { rows, columns } = this.props;
    const board = [];

    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = {
          isOpened: false,
          isMarked: false,
          isMine: false,
          value: ''
        }
      }
    }

    return board;
  }

  placeMines(board) {
    let { mines, rows, columns } = this.props;
    const boardWithMines = [...board];

    while (mines) {
      const row = Math.floor(Math.random() * rows);
      const column = Math.floor(Math.random() * columns);

      if (!boardWithMines[row][column].isMine) {
        boardWithMines[row][column].isMine = true;
        mines = mines - 1;
      }
    }

    return boardWithMines;
  }

  setValues(board) {
    const { rows, columns } = this.props;
    const boardWithValues = [...board];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const cell = boardWithValues[i][j];
        if (!cell.isMine) {
          const adjacentCells = this.getAdjacentCells(board, i, j);
          const numberOfMinesAround = adjacentCells.filter((cell) => cell.isMine === true).length;
  
          if (numberOfMinesAround) {
            cell.value = numberOfMinesAround;
          }
        }
      }
    }

    return boardWithValues;
  }

  getAdjacentCells(board, row, column) {
    const adjacentCells = [];

    for (let dx = -1; dx <= 1; ++dx) {
      for (let dy = -1; dy <= 1; ++dy) {
          const cell = board[row + dx] ? board[row + dx][column + dy] : null;
          if (cell && (dx !== 0 || dy !== 0)) {
            adjacentCells.push(cell);
          }
      }
    }

    return adjacentCells;
  }

  drawBoard() {
    const { board } = this.state;

    return (
      <React.Fragment>
        {board && board.map((row, rowIndex) => (
          <div className="row" key={'row_' + rowIndex}>
            {row.map((cell, cellIndex) => (
              <Cell key={'cell_' + cellIndex} x={rowIndex} y={cellIndex} value={cell.value} isOpened={cell.isOpened} isMarked={cell.isMarked} isMine={cell.isMine} onCellClick={this.handleCellClick} />
            ))}
          </div>
        ))}
      </React.Fragment>
    );
  }

  endGame() {
    const { board } = this.state;
    const { rows, columns } = this.props;
    
    const updatedBoard = [...board];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        updatedBoard[i][j].isOpened = true;
      }
    }

    this.setState({
      board: updatedBoard,
      isGameOver: true
    })
  }

  handleCellClick(type, row, column) {
    const { board, isGameOver, markersLeft } = this.state;

    if (isGameOver) {
      return;
    }

    let modifiedBoard = [...board];
    const cell = modifiedBoard[row][column]
    const { isOpened, isMine, isMarked } = cell;

    if (type === 'click' && !isMarked) {
      if (isMine) {
        this.endGame();
      } else {
        modifiedBoard = this.openCell(modifiedBoard, row, column);
      }
    }

    if (type === 'contextmenu' && !isOpened) {
      if (cell.isMarked || markersLeft > 0)
        cell.isMarked = !cell.isMarked;
    }

    this.setState({
      board: modifiedBoard
    })

    this.examineBoard();
  }

  openCell(board, row, column) {
    const { rows, columns } = this.props;

    if (row >= rows || column >= columns || row < 0 || column < 0) {
      return board;
    }

    const modifiedBoard = [...board];
    const cell = modifiedBoard[row][column];

    if (cell.isOpened) {
      return board;
    }

    cell.isOpened = true;

    if (!cell.value) {
      this.openCell(modifiedBoard, row - 1, column);
      this.openCell(modifiedBoard, row + 1, column);
      this.openCell(modifiedBoard, row, column - 1);
      this.openCell(modifiedBoard, row, column + 1);
    }

    return modifiedBoard;
  }

  examineBoard() {
    const { board } = this.state;
    const { mines } = this.props;
    let markersLeft = null;
    let isWon = false;

    const cells = board.flat();
    const cellsCount = cells.length;
    const numberOfMarked = cells.filter((cell) => cell.isMarked === true).length;
    const numberOfOpened = cells.filter((cell) => cell.isOpened === true).length;

    markersLeft = mines - numberOfMarked;

    if (cellsCount === (numberOfMarked + numberOfOpened)) {
      isWon = true;
    }

    this.setState({
      markersLeft,
      isWon
    });
  }

  render() {
    const { isWon, isGameOver, markersLeft } = this.state;

    return (
      <div className="board">
        <div className="board__header">
          {isWon && <span>You won!</span>}
          {isGameOver && <span>You lost!</span>}
          <span>Markers left: {markersLeft}</span>
        </div>
        <div className="board__content">
          {this.drawBoard()}
        </div>
        <div className="board__footer">
          <span>Open cell</span>
          <img className="icon" src={mouseImage} alt=""></img>
          <span>Mark mine</span>
        </div>
      </div>
    );
  }
}

export default Board;