import React, { useEffect } from 'react';
import { setupServiceWorker, SwRegistrationResult } from './lib/setupServiceWorker';
import setupWebWorker from './lib/setupWebWorker';
import logo from './logo.svg';
import './App.css';

export interface AppProps {
}

function App({ sw }: AppProps) {
  //. Service Worker
  const onSwMessage = (m: any) => {
    console.debug('APP: sw message received ->', m);
  };

  sw.registerCallback(onSwMessage);

  function pingServiceWorker() {
    sw.postMessage('test sw message');
  }

  //. Web Worker
  const onWwMessage = (m: MessageEvent) => {
    console.debug('APP: ww message received ->', m.data);
  };

  const ww = setupWebWorker(onWwMessage);

  function pingWebWorker() {
    ww.postMessage('test ww message');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Doing some testing.
        </p>
        <button onClick={pingServiceWorker}>
          Ping Service Worker
        </button>
        <button onClick={pingWebWorker}>
          Ping Web Worker
        </button>
      </header>
    </div>
  );
}

export default App;
