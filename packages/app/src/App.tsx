import { select } from '@ngneat/elf';
import { useObservable } from '@ngneat/use-observable';
import React, { useEffect, useState } from 'react';
import './App.css';
import { SwRegistrationResult } from './lib/setupServiceWorker';
import AppWorker from './lib/setupWebWorker';
import logo from './logo.svg';

export interface AppProps {
  sw?: SwRegistrationResult;
  ww: AppWorker;
}

function App({ sw, ww }: AppProps) {
  //. Service Worker (sw)
  function onSwMessage(m: any) {
    console.debug('[APP] sw message received ->', m);
  }

  sw?.registerCallback(onSwMessage);

  function pingServiceWorker() {
    sw?.postMessage('test sw message');
  }

  //. Web Worker (ww)
  const [wwMessage, setWwMessage] = useState<any>(null);
  const [count] = useObservable(ww.view.pipe(select((state) => state.count)));

  function onWwMessage(data: any) {
    console.debug('[APP] ww message received ->', data);
    setWwMessage(data);
  }

  useEffect(() => {
    ww.subscribe(onWwMessage);
    ww.setupStateLink('count');
  }, []);

  function pingWebWorker() {
    ww.send({ ping: 'hello' });
  }

  function incrementCount() {
    ww.dispatch('count', count + 1);
  }
  function decrementCount() {
    ww.dispatch('count', count - 1);
  }
  function clearCount() {
    ww.dispatch('count', 0);
  }

  return (
    <div className="App">

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Web Worker State Machine
        </p>
      </header>

      <h2>Ping Workers</h2>
      <section>
        <button onClick={pingServiceWorker} disabled>
          Ping Service Worker
        </button>
        <button onClick={pingWebWorker}>
          Ping Web Worker
        </button>
        <p>Last WW Message:</p>
        {wwMessage && (<code>{JSON.stringify(wwMessage)}</code>)}
      </section>

      <h2>Counter App</h2>
      <section>
        <div style={{ marginBottom: '1em' }}>
          <span style={{ marginRight: '1.5em' }}>Count</span>
          <span>{count}</span>
        </div>
        <button onClick={incrementCount}>
          Increment count
        </button>
        <button onClick={decrementCount}>
          Decrement count
        </button>
        <button onClick={clearCount}>
          Clear count
        </button>
      </section>
    </div>
  );
}

export default App;
