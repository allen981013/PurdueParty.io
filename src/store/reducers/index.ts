// Import reducers and state type declarations here
import eventReducer from './eventReducer';
import signInReducer from './signInReducer';
import { combineReducers } from 'redux';


/* TODO: Replace these with the proper type */
type SignInStateFixLater = any;
type EventStateFixLater = any;


export type RootState = {
    signIn: SignInStateFixLater;    
    event: EventStateFixLater;
}


// Add reducers to this list
const rootReducer = combineReducers({
    signIn: signInReducer,
    event: eventReducer
});

export default rootReducer;