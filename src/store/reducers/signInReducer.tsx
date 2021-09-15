// Dummy Data for testing, this gets replaced by Firebase call
const initState = {
    auth: [
        
    ]
};

const signInReducer = (state = initState, action:any) => {
    switch (action.type) {
        case 'LOG_IN':
            console.log('user logged in');
            return state;
        case 'LOG_IN_ERR':
            console.log('error during user login');
            return state;
        default :
            console.log('login default case');
            console.log(state);
            return state;
    }
}

export default signInReducer;