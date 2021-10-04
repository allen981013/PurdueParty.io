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
import { eventsLandingSlice } from '../../components/events/EventsLandingSlice';

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
    eventsLanding: eventsLandingSlice.reducer
});

export default rootReducer;
