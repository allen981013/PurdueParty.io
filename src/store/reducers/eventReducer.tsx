import { Timestamp } from '@firebase/firestore';

// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    events: [
        {
            id: "1", owner: "owner", editors: ["editor"],
            orgID: "", title: "", description: "", location: "",
            startTime: new Date(0), endTime: new Date(0),
            postedDateTime: new Timestamp(0, 0), attendees: [""]
        }
    ]
};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const eventReducer = (state = initState, action: Action) => {
    switch (action.type) {
        case 'ADD_EVENT_SUCCESS':
            console.log('added new event');
            return state;
        case 'ADD_EVENT_ERR':
            console.log('error adding new event');
            return state;
        case 'RSVP_EVENT_SUCCESS':
            console.log('rsvp to event');
            return state;
        case 'RSVP_EVENT_ERR':
            console.log('error rsvp to event');
            return state;
        case 'RSVP_REMOVE_EVENT_SUCCESS':
            console.log('removing rsvp to event');
            return state;
        case 'RSVP_REMOVE_EVENT_ERR':
            console.log('error removing rsvp to event');
            return state;
        case 'DELETE_EVENT_SUCCESS':
            console.log("deleted event");
            return {
                ...state,
                deleteEventError: false,
            }
        case 'DELETE_EVENT_ERROR':
            console.log("error during delete event");
            return {
                ...state,
                deleteEventError: true,
            }
        case 'EDIT_EVENT_SUCCESS':
            console.log("edited event");
            return {
                ...state,
                deleteEventError: false,
            }
        case 'SAVE_EVENT_SUCCESS':
            console.log('saved event');
            return state;
        case 'SAVE_EVENT_ERROR':
            console.log('error saving event');
            return state;
        case 'SAVE_REMOVE_EVENT_SUCCESS':
            console.log('removed saved event');
            return state;
        case 'SAVE_REMOVE_EVENT_ERROR':
            console.log('error removing saved event');
            return state;
        default:
            return state;
    }
}

export default eventReducer;