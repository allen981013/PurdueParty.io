import { PlaylistAddOutlined } from "@mui/icons-material";

type AuthState = {
  authError?: string,
  lastCheckedUsername?: string,
  lastCheckedIsLoggedIn: boolean,
  lastCheckedJoinedClassIDs: string[],
}

const initState: AuthState = {  // NOTE: We need this type annotation so that the RootState type can be inferred properly. 
  authError: undefined,       // Perhaps because initState prop, authError, can assume two types (string and undefined).
  lastCheckedUsername: null,
  lastCheckedIsLoggedIn: false,
  lastCheckedJoinedClassIDs: [],
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
        lastCheckedJoinedClassIDs: action.payload.lastCheckedJoinedClassIDs,
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
        lastCheckedUsername: undefined,
        lastCheckedJoinedClassIDs: null,
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
    case 'DELETE_SUCCESS':
      console.log('user deleted');
      return {
        ...state,
        authError: undefined
      }
    case 'DELETE_ERROR':
      console.log('err deleting user');
      return {
        ...state,
        authError: "User delete failed"
      }
    case 'USER_DATA_REFRESHED':
      return {
        ...state,
        lastCheckedUsername: action.payload.lastCheckedUsername,
        lastCheckedJoinedClassIDs: action.payload.lastCheckedJoinedClassIDs,
        lastCheckedIsLoggedIn: action.payload.lastCheckedIsLoggedIn
      }
    case 'RESET_PASS_SUCCESS':
      return {
        ...state,
        authError: undefined
      }
    case 'RESET_PASS_ERR':
      return {
        ...state,
        authError: "Reset user password error"
      }
    case 'CHANGE_PASS_ERR':
      return {
        ...state,
        authError: "Change user password error"
      }
    case 'REAUTH_SUCCESS':
      return {
        ...state,
        authError: undefined
      }
    case 'REAUTH_ERR':
      return {
        ...state,
        authError: "Error during user reauthentication"
      }
    default:
      return state;
  }
}

export default authReducer;