import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

const App: React.FC = () => {
  
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Main />
      </div>
    </Router>
  );
}

export default App;
