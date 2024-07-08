import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/">DataStore Sync Demo</Link></li>
        <li><Link to="/graphql">GraphQL Demo</Link></li>
        <li><Link to="/rest">REST Demo</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
