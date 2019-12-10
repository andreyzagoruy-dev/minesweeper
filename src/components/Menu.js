import React from 'react';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      difficulty: 10,
      size: 8
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    const { startGame } = this.props;
    event.preventDefault();

    startGame(this.state);
  }

  render() {
    return (
      <div className="menu">
        <h1 className="game-title">The Minesweeper</h1>
        <form className="form-config" onSubmit={this.handleSubmit}>
          <label className="form-config__label">
            Size
            <select className="form-config__select" name="size" value={this.state.size} onChange={this.handleChange}>
              <option value="6">Tiny</option>
              <option value="8">Normal</option>
              <option value="10">Huge</option>
            </select>
          </label>
          <label className="form-config__label">
            Difficulty
            <select className="form-config__select" name="difficulty" value={this.state.difficulty} onChange={this.handleChange}>
              <option value="5">Easy</option>
              <option value="10">Moderate</option>
              <option value="15">Hard</option>
            </select>
          </label>
          <button className="button button--primary form-config__button">New Game</button>
        </form>
      </div>
    );
  }
}

export default Menu;