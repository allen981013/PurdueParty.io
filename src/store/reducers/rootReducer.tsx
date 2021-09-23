// Import each page's reducer here
import eventReducer from './eventReducer';
import authReducer from './authReducer';
import homepageReducer from './homepageReducer';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import { combineReducers } from 'redux';

// Add it to this list
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    auth: authReducer,
    event: eventReducer,
    homepage: homepageReducer
});

export default rootReducer;