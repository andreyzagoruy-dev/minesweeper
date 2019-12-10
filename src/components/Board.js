import React from 'react';
import Cell from './Cell';
import mouseImage from './../assets/mouse.svg';

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
    this.goToMenu = this.goToMenu.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    this.startGame();
  }

  startGame() {
    const emptyBoard = this.generateEmptyBoard();
    const boardWithMines = this.placeMines(emptyBoard);
    const boardWithValues = this.setValues(boardWithMines);
    const initialBoardState = {
      isGameOver: false,
      isWon: false,
      markersLeft: this.props.mines
    }

    this.setState({
      board: boardWithValues,
      ...initialBoardState
    });
  }

  generateEmptyBoard() {
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
    const boardWithMines = JSON.parse(JSON.stringify(board));

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
    const boardWithValues = JSON.parse(JSON.stringify(board));

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
              <Cell
                key={'cell_' + cellIndex}
                x={rowIndex}
                y={cellIndex}
                value={cell.value}
                isOpened={cell.isOpened}
                isMarked={cell.isMarked}
                isMine={cell.isMine}
                onCellClick={this.handleCellClick} />
            ))}
          </div>
        ))}
      </React.Fragment>
    );
  }

  endGame() {
    const { board } = this.state;
    const { rows, columns } = this.props;
    
    const updatedBoard = JSON.parse(JSON.stringify(board));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        updatedBoard[i][j].isOpened = true;
      }
    }

    this.setState({
      board: updatedBoard,
      isGameOver: true
    });
  }

  handleCellClick(type, row, column) {
    const { board, isGameOver, markersLeft } = this.state;

    if (isGameOver) {
      return;
    }

    let modifiedBoard = JSON.parse(JSON.stringify(board));
    const cell = modifiedBoard[row][column]
    const { isOpened, isMine, isMarked } = cell;

    if (type === 'click' && !isMarked) {
      if (isMine) {
        this.endGame();
        return;
      } else {
        modifiedBoard = this.openCell(modifiedBoard, row, column);
      }
    }

    if (type === 'contextmenu' && (!isOpened || isMarked)) {
      if (isMarked || markersLeft > 0)
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

    const cell = board[row][column];

    if (cell.isOpened) {
      return board;
    }

    cell.isOpened = true;

    if (!cell.value) {
      this.openCell(board, row - 1, column);
      this.openCell(board, row + 1, column);
      this.openCell(board, row, column - 1);
      this.openCell(board, row, column + 1);
    }

    return board;
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

  goToMenu() {
    const { changeGameState } = this.props;
    changeGameState('menu');
  }

  render() {
    const { isWon, isGameOver, markersLeft } = this.state;
    const isGameRunning = !isGameOver && !isWon;

    return (
      <React.Fragment>
        <div className="game-header">
          <button
            className="button button--icon game-header__left"
            onClick={this.goToMenu}>
              ←
          </button>
          {isWon && (
            <span className="game-header__center">
              You won!
            </span>
          )}
          {isGameOver && (
            <span className="game-header__center">
              You lost!
            </span>
          )}
          <span className="game-header__right">
            Markers left: {markersLeft}
          </span>
        </div>
        <div className="game-content">
          {this.drawBoard()}
        </div>
        <div className="game-footer">
          {isGameRunning &&
            <React.Fragment>
              <span>Open cell</span>
              <img className="icon" src={mouseImage} alt=""></img>
              <span>Mark mine</span>
            </React.Fragment>
          }
          {!isGameRunning && (
            <React.Fragment>
              <button
                className="button button--primary game__button"
                onClick={this.goToMenu}>
                  New Game
              </button>
              <button
                className="button button--secondary game__button"
                onClick={this.startGame}>
                  Restart
              </button>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Board;