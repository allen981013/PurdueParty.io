import { Timestamp } from '@firebase/firestore';

// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    events: [
        {id: "1", owner: "owner", editors: ["editor"],
         orgID: "", title: "", description: "", location: "",
         dateTime: new Timestamp(0,0), 
         postedDateTime: new Timestamp(0,0), attendees: [""], 
         type: ""}
    ]
};

const eventReducer = (state = initState, action:any) => {
    switch (action.type) {
        case 'ADD_EVENT_SUCCESS':
            console.log('added new event');
            return state;
        case 'ADD_EVENT_ERR':
            console.log('error adding new event');
            return state;
        default :
            return state;
    }
}

export default eventReducer;