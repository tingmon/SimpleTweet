import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './fbase';
import App from './components/App';
console.log(firebase);


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


