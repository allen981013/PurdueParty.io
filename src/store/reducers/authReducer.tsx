// Dummy Data for testing, this gets replaced by Firebase call
const initState = {
    authError: null
};

const authReducer = (state = initState, action:any) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            console.log('user logged in');
            return {
                ...state,
                authError: null
            }
        case 'LOGIN_ERROR':
            console.log('error during user login');
            return {
                ...state, 
                authError: 'Login failed'
            }
        case 'SIGNOUT_SUCCESS':
            console.log('user signed out');
            return state;
        case 'SIGNOUT_ERROR':
            console.log('error during user sign out');
            return {
                ...state,
                authError: 'Signout failed'
            }
        case 'SIGNUP_SUCCESS':
            console.log('user signed up');
            return {
                ...state,
                authError: null
            }
        case 'SIGNUP_ERROR':
            console.log('err during user sign up');
            return {
                ...state,
                authError: "Signup failed"
            }
        default :
            return state;
    }
}

export default authReducer;