import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers/rootReducer'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getFirebase, ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { getFirestore, createFirestoreInstance, reduxFirestore } from 'redux-firestore';

const firebaseConfig: any = {
  apiKey: "AIzaSyAtGu2EAwCasekXH6yzYxy7NqqA3APpus0",
  authDomain: "purdueparty-44444.firebaseapp.com",
  projectId: "purdueparty-44444",
  storageBucket: "purdueparty-44444.appspot.com",
  messagingSenderId: "293448047222",
  appId: "1:293448047222:web:70c8cbde89c4c87e745d57",
  measurementId: "G-F5BYJVJC65"
};

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  enableClaims: true
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();
console.log(firebase);

const initialState = {};

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reduxFirestore(firebase, firebaseConfig)
  ));


const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};
  

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App />
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
