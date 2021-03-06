import React from 'react';
import ReactDOM from 'react-dom';
import App, { AppProps } from './App';
import './index.css';
import { setupServiceWorker } from './lib/setupServiceWorker';
import AppWorker from './lib/setupWebWorker';
import reportWebVitals from './reportWebVitals';

function renderApp(props: AppProps) {
  ReactDOM.render(
    <React.StrictMode>
      <App {...props} />
    </React.StrictMode>,
    document.getElementById('root'),
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}

const ww = new AppWorker('/web-worker.min.js');

setupServiceWorker().then((sw) => {
  console.debug(sw);
  renderApp({ sw, ww });
}).catch((err) => {
  console.error(err);
  renderApp({ ww });
});
