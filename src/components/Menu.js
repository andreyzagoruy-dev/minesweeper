import React from 'react';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      difficulty: 10,
      size: 8
    }
    this.sizeOptions = [
      { name: 'Tiny', value: 6 },
      { name: 'Normal', value: 8 },
      { name: 'Huge', value: 10 },
    ];
    this.difficultyOptions = [
      { name: 'Easy', value: 5 },
      { name: 'Moderate', value: 10 },
      { name: 'Hard', value: 15 },
    ];

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    const { startGame } = this.props;
    const { difficulty, size } = this.state;
    event.preventDefault();

    startGame({
      difficulty,
      size
    });
  }

  render() {
    const { difficultyOptions, sizeOptions, handleChange, handleSubmit } = this;
    const { difficulty, size } = this.state;

    return (
      <div className="menu">
        <h1 className="game-title">The Minesweeper</h1>
        <form className="form-config" onSubmit={handleSubmit}>
          <label className="form-config__label">
            Size
            <select
              className="form-config__select"
              name="size"
              value={size}
              onChange={handleChange}
              >
                {sizeOptions.map((option, index) => (
                  <option
                    key={'size_option_' + index}
                    value={option.value}
                    >
                      {option.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="form-config__label">
            Difficulty
            <select
              className="form-config__select"
              name="difficulty"
              value={difficulty}
              onChange={handleChange}
              >
                {difficultyOptions.map((option, index) => (
                  <option
                    key={'difficulty_option_' + index}
                    value={option.value}
                    >
                      {option.name}
                  </option>
                ))}
            </select>
          </label>
          <button className="button button--primary form-config__button">New Game</button>
        </form>
      </div>
    );
  }
}

export default Menu;