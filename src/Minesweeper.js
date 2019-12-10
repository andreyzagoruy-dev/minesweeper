import React from 'react';
import './css/styles.css';
import Menu from './components/Menu';
import Board from './components/Board';

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {
        difficulty: null,
        size: null
      },
      gameState: 'menu'
    }

    this.startGame = this.startGame.bind(this);
    this.changeGameState = this.changeGameState.bind(this);
  }

  startGame(config) {
    this.setState({
      config
    });
    this.changeGameState('game');
  }

  changeGameState(newGameState) {
    this.setState({
      gameState: newGameState
    });
  }

  render() {
    const { config, gameState } = this.state;
    const isMenu = gameState === 'menu';
    const isGame = gameState === 'game';

    return (
      <div className="minesweeper">
          {isMenu && <Menu startGame={this.startGame} />}
          {isGame && <Board rows={config.size} columns={config.size} mines={config.difficulty} changeGameState={this.changeGameState} />}
      </div>
    );
  }
}

export default Minesweeper;
