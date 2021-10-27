import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { RootState } from '../../store'
import moment from 'moment'
import { ClubsProps } from './Clubs'

export interface ClubsFetchParameter {
  searchKeyword: string;
}

// type for states returned by reducer
interface ClubsPageReduxState {
  clubs?: ClubsProps["clubs"];
}

// initial states
const initState: ClubsPageReduxState = {
  clubs: undefined
}

// create slice
export const clubsPageSlice = createSlice({
  name: 'classPage',
  initialState: initState,
  reducers: {
    fetchClubsSuccess: (state: ClubsPageReduxState, action): ClubsPageReduxState => {
      return {
        ...state,
        clubs: action.payload,
      }
    },
  },
})

// actions 

export const fetchClubs = (fetchParameter: ClubsFetchParameter) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // Build query
    const db = getFirestore();
    var clubsQueryPromise = db.collection("clubs")
    clubsQueryPromise = fetchParameter.searchKeyword != ""
      ? clubsQueryPromise
        .where("title", ">=", fetchParameter.searchKeyword.toUpperCase())
        .where("title", "<", fetchParameter.searchKeyword + '\uf8ff')
        .orderBy("title", "asc")
      : clubsQueryPromise.orderBy("title", "asc")
    // Populate clubs
    var clubs: ClubsProps["clubs"] = []
    clubsQueryPromise.get().then((clubsQuerySnapshot: any) => {
      clubs = clubsQuerySnapshot.docs.map((docSnapshot: any) => {
        let club = docSnapshot.data()
        return {
          title: club.title,
          description: club.description,
          image: club.image,
          id: club.id,
        }
      })
      clubs = clubs.filter((club) => club.title.toUpperCase().includes(fetchParameter.searchKeyword.toUpperCase()))
      dispatch(clubsPageSlice.actions.fetchClubsSuccess(clubs))
    })
  }
}
