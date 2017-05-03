import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App numRings="3" centerX="200" centerY="200" radius="100" />,
  document.getElementById('root')
);
