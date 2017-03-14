import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App soundPrefix="pi" numSounds="10" experimentOneRepetitions="1"/>,
  document.getElementById('root')
);
