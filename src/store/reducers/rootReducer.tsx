// Import each page's reducer here
import eventReducer from './eventReducer';
import authReducer from './authReducer';
import homepageReducer from './homepageReducer';
import marketplaceReducer from './marketplaceReducer';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import { combineReducers } from 'redux';
import { landing } from '../../components/landing/LandingSlice';
import { eventInfoSlice } from '../../components/events/EventInfoSlice';

// Add it to this list
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    auth: authReducer,
    event: eventReducer,
    landing: landing.reducer,
    homepage: homepageReducer,
    marketplace: marketplaceReducer,
    eventInfo: eventInfoSlice.reducer,
});

export default rootReducer;
