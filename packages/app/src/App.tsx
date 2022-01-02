import React from 'react';
import { SwRegistrationResult } from './lib/setupServiceWorker';
import logo from './logo.svg';
import './App.css';

export interface AppProps {
  sw?: SwRegistrationResult;
}

function App(props: AppProps) {
  props.sw?.registerCallback((m: any) => {
    console.debug('APP: message received ->', m);
  });

  function onClick() {
    props.sw?.postMessage('test message');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Doing some testing.
        </p>
        <button onClick={onClick}>
          Ping
        </button>
      </header>
    </div>
  );
}

export default App;
