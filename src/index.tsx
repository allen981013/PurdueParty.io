import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers/rootReducer'
import { initializeApp } from 'firebase/app';
import { getFirestore  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import thunk from 'redux-thunk';

const firebaseConfig = {
  apiKey: "AIzaSyAtGu2EAwCasekXH6yzYxy7NqqA3APpus0",
  authDomain: "purdueparty-44444.firebaseapp.com",
  projectId: "purdueparty-44444",
  storageBucket: "purdueparty-44444.appspot.com",
  messagingSenderId: "293448047222",
  appId: "1:293448047222:web:70c8cbde89c4c87e745d57",
  measurementId: "G-F5BYJVJC65"
};

const app = initializeApp(firebaseConfig);

// May also want to pass getAuth however not necesarry for most components
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirestore }))
  ));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
