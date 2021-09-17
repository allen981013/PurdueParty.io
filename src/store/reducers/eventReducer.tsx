<<<<<<< HEAD
// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    events: [
        {id: '1', title: 'Purdue Rowing Callout'},
        {id: '1', title: 'Bowling Night'},
        {id: '1', title: 'Frisbee Game'}
    ]
};

const eventReducer = (state = initState, action:any) => {
    switch (action.type) {
        case 'ADD_EVENT':
            console.log('added new event');
            return state;
        case 'ADD_EVENT_ERR':
            console.log('error adding new event');
            return state;
        default :
            return state;
    }
}

=======
// Dummy Data for testing, this gets replaced by Firebase call
const initState = {
    events: [
        {id: '1', title: 'Purdue Rowing Callout'},
        {id: '1', title: 'Bowling Night'},
        {id: '1', title: 'Frisbee Game'}
    ]
};

const eventReducer = (state = initState, action:any) => {
    switch (action.type) {
        case 'RETRIEVE_EVENTS':
            console.log('retrieved events list');
            return state;
        case 'RETRIEVE_EVENTS_ERR':
            console.log('error retrieving events list');
            return state;
        default :
            return state;
    }
}

>>>>>>> main
export default eventReducer;