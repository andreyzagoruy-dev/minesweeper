import React from 'react';
import './App.css';
import Board from './Board';

function App() {
  return (
    <div className="minesweeper">
        <Board rows={8} columns={8} mines={5} />
    </div>
  );
}

export default App;
