import React from 'react';
import ComprehensiveComponent from './components/ComprehensiveComponent/ComprehensiveComponent';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <ComprehensiveComponent initialCount={0} />
    </div>
  );
}

export default App;
