import { Timestamp } from '@firebase/firestore';

// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    clubs: [
        {  id: "string",
            owner: "string",    
            editors: [""],
            title: "string",
            description: "string",
            contactInfo: "string",
            postedDateTime: new Timestamp(0,0),
            attendees: [""],
            type: "string",
            event: [""]}    
    ]
};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const clubReducer = (state=initState, action: Action) => {
    switch (action.type) {
        case 'ADD_CLUB_SUCCESS':
            console.log('added new club');
            return state;
        case 'ADD_CLUB_ERR':
            console.log('error adding new club');
            return state;
        default :
            return state;
    }
}

export default clubReducer;