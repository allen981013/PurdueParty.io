// Import each page's reducer here
import eventReducer from './eventReducer';
import signInReducer from './signInReducer';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import { combineReducers } from 'redux';

// Add it to this list
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    signIn: signInReducer,
    event: eventReducer,
});

export default rootReducer;