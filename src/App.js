import React from 'react';
import './App.css';
import Heatmap from './componets/Heatmap'

function App() {


  return (
    <div className="App">
      <header className="App-header">
        <div style={{ height: '100vh', width: '100%' }}>
          <Heatmap>Heatmap</Heatmap>
        </div>
      </header>
    </div>
  );
}

export default App;
