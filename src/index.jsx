import React from 'react';
import ReactDom from 'react-dom';
// import App from './app/pages/app1';
import { StoreProvider } from 'easy-peasy';
import App from './app/router';
import { store } from './app/store/store';
// console.log(store);
ReactDom.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
);
