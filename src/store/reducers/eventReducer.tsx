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
            console.log('events default case');
            console.log(state);
            return state;
    }
}

export default eventReducer;