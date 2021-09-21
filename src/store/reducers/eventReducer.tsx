// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    events: [
        {id: '1', title: 'Purdue Rowing Callout'},
        {id: '1', title: 'Bowling Night'},
        {id: '1', title: 'Frisbee Game'}
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
        default :
            return state;
    }
}

export default eventReducer;