

// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    events: [
        {id: "1", bio: "", userName:"", major:"", year:""}
    ]
};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const profileReducer = (state=initState, action: Action) => {
    switch (action.type) {
        case 'EDITE_PROFILE_SUCCESS':
            console.log('Profile has been edited');
            return state;
        case 'EDITE_PROFILE_ERR':
            console.log('Error editing');
            return state;
        default :
            return state;
    }
}

export default profileReducer;