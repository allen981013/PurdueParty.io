import { PlaylistAddOutlined } from "@mui/icons-material";

type AuthState = {
  authError?: string,
  lastCheckedUsername: string,
  lastCheckedIsLoggedIn: boolean,
}

const initState: AuthState = {  // NOTE: We need this type annotation so that the RootState type can be inferred properly. 
  authError: undefined,       // Perhaps because initState prop, authError, can assume two types (string and undefined).
  lastCheckedUsername: "guest",
  lastCheckedIsLoggedIn: false,
};


type Action = {
  type: string,
  payload?: any, // Annotate the payload with proper type, if there are any
}

const authReducer = (state = initState, action: Action): AuthState => {

  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log('user logged in: ', action.payload);
      return {
        ...state,
        lastCheckedUsername: action.payload.lastCheckedUsername,
        lastCheckedIsLoggedIn: true,
        authError: undefined
      }
    case 'LOGIN_ERROR':
      console.log('error during user login');
      return {
        ...state,
        authError: 'Login failed'
      }
    case 'SIGNOUT_SUCCESS':
      console.log('user signed out');
      return {
        ...state,
        lastCheckedUsername: "guest",
        lastCheckedIsLoggedIn: false,
      };
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
        authError: undefined
      }
    case 'SIGNUP_ERROR':
      console.log('err during user sign up');
      return {
        ...state,
        authError: "Signup failed"
      }
    case 'USER_DATA_REFRESHED':
      return {
        ...state,
        lastCheckedUsername: action.payload.lastCheckedUsername,
        lastCheckedIsLoggedIn: action.payload.lastCheckedIsLoggedIn
      }
    default:
      return state;
  }
}

export default authReducer;