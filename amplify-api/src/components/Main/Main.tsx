import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './Main.css';
import DataStore from '../DataStoreSynch/DataStoreSynch';
import APIGraphQL from '../APIGraphQL/APIGraphQL';

const Main: React.FC = () => {
  return (
    <div className="main">
      <Routes>
        <Route path="/" element={<DataStore />} />
        <Route path="/graphql" element={<APIGraphQL />} />
      </Routes>
    </div>
  );
};

export default Main;