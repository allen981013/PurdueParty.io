import { Timestamp } from '@firebase/firestore';

export interface ClubsFetchParameter {
  searchKeyword: string;
}

// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
  fetchParameter: {searchKeyword: ""}
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
    case 'CLUBS_FETCH_PARAM_UPDATED':
      return {
        ...state,
        fetchParameter: action.payload
      }
    default:
      return state;
  }
}

export default clubReducer;