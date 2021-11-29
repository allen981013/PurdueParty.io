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
import profileReducer from './profileReducer';
import { threadPageSlice } from '../../components/forum/ThreadPageSlice';
import { classPageSlice } from '../../components/forum/ClassPageSlice';
import { clubsPageSlice } from '../../components/clubs/ClubsPageSlice';
import { gymSlice } from '../../components/gym/GymSlice';
import clubReducer from './clubReducer';
import diningReducer from './diningReducer';
import { forumMainPageSlice } from '../../components/forum/ForumMainPageSlice';

// Add it to this list
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    auth: authReducer,
    event: eventReducer,
    landing: landingSlice.reducer,
    marketplace: marketplaceReducer,
    eventInfo: eventInfoSlice.reducer,
    eventsLanding: eventsLandingSlice.reducer,
    profileReducer: profileReducer,
    forumMainPage: forumMainPageSlice.reducer,
    threadPage: threadPageSlice.reducer,
    classPage: classPageSlice.reducer,
    club: clubReducer,
    clubsPage: clubsPageSlice.reducer,
    dining: diningReducer,
    gym: gymSlice.reducer,
});

export default rootReducer;
