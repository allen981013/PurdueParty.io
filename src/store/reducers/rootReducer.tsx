// Import each page's reducer here
import eventReducer from './eventReducer';
import authReducer from './authReducer';
import marketplaceReducer from './marketplaceReducer';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import { combineReducers } from 'redux';
import { landingSlice } from '../../components/landing/LandingSlice';
import { eventInfoSlice } from '../../components/events/EventInfoSlice';
import { eventsLandingSlice } from '../../components/events/EventsLandingSlice';

// Add it to this list
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    auth: authReducer,
    event: eventReducer,
    landing: landingSlice.reducer,
    marketplace: marketplaceReducer,
    eventInfo: eventInfoSlice.reducer,
    eventsLanding: eventsLandingSlice.reducer
});

export default rootReducer;
