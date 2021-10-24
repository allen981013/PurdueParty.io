import { Timestamp } from '@firebase/firestore';

// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    events: [
        {id: "1", owner: "owner", editors: ["editor"],
         orgID: "", title: "", description: "", location: "",
         startTime: new Date(0), endTime: new Date(0),
         postedDateTime: new Timestamp(0,0), attendees: [""]}
    ]
};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const eventReducer = (state=initState, action: Action) => {
    switch (action.type) {
        case 'ADD_EVENT_SUCCESS':
            console.log('added new event');
            return state;
        case 'ADD_EVENT_ERR':
            console.log('error adding new event');
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
        default :
            return state;
    }
}

export default eventReducer;