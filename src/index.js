import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


ReactDOM.render(
  <App soundPrefix="pi" numSounds="10" experimentOneRepetitions="2" fileSuffix=".wav" experimentTwoRepetitions="5" logo="./logo.svg"/>,
  document.getElementById('root')
);
