// Import each page's reducer here
import eventReducer from './eventReducer';
import signInReducer from './signInReducer';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';

// Add it to this list
const rootReducer = combineReducers({
    signIn: signInReducer,
    event: eventReducer,
    firestore: firestoreReducer
});

export default rootReducer;