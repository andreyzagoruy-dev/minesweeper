import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { x, y } = this.props;

    event.preventDefault();

    if (event.type === 'click' || event.type === 'contextmenu') {
      this.props.onCellClick(event.type, x, y);
    }
  }

  getCellModifier() {
    const { value, isOpened, isMarked, isMine } = this.props;

    if (isMarked) {
      return 'cell--marked';
    }
    if (isMine && isOpened) {
      return 'cell--mine';
    }
    if (!isMarked && isOpened && !value) {
      return 'cell--empty';
    }
    if (!isOpened) {
      return 'cell--closed';
    }

    return '';
  }

  render() {
    const { value } = this.props;
    return (
      <div className={`cell ${this.getCellModifier()}`} onClick={this.handleClick} onContextMenu={this.handleClick}>{value}</div>
    );
  }
}

export default Cell;