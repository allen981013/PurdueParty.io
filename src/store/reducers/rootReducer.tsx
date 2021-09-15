// Import each page's reducer here
import eventReducer from './eventReducer';
import signInReducer from './signInReducer';
import { combineReducers } from 'redux';

// Add it to this list
const rootReducer = combineReducers({
    signIn: signInReducer,
    event: eventReducer
});

export default rootReducer;