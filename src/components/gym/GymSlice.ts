import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { Timestamp } from 'firebase/firestore'
import { RootState } from '../../store'
import { FacilityInfo } from './Gym'
import { actionTypes } from 'react-redux-firebase'
import { forumMainPageSlice } from '../forum/ForumMainPageSlice'
import { Class } from '../forum/ForumMainPage'

// type for states returned by reducer
export interface GymStatesRedux {
  facilityInfos?: FacilityInfo[];
  lastUpdatedTime?: string;
  errorMessage?: string;
}

// initial states
const initState: GymStatesRedux = {
  facilityInfos: null,
  lastUpdatedTime: null,
  errorMessage: null,
}

// create slice
export const gymSlice = createSlice({
  name: 'gymSlice',
  initialState: initState,
  reducers: {
    facilityInfosFetched: (state: GymStatesRedux, action): GymStatesRedux => {
      return {
        ...state,
        facilityInfos: action.payload.facilityInfos,
        lastUpdatedTime: action.payload.lastUpdatedTime,
        errorMessage: null,
      }
    },
    facilityInfosFetchError: (state: GymStatesRedux, action): GymStatesRedux => {
      return {
        ...state,
        facilityInfos: [],
        lastUpdatedTime: action.payload.lastUpdatedTime,
        errorMessage: action.payload.errorMessage,
      }
    }
  },
})

// actions 

export const fetchFacilityInfos = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // Query the API 
    const endpoint = "https://www.purdue.edu/recwell/data/c2c-api.php"
    fetch(endpoint).then(res => res.json()).then((result) => {
      let facilityInfos: FacilityInfo[] = result
      let lastUpdatedTime: string = null
      facilityInfos = facilityInfos.map((info: any) => {
        lastUpdatedTime = new Date(info.LastUpdatedDateAndTime).toLocaleString()
        return {
          name: info.LocationName,
          lastParticipantCount: !info.IsClosed ? info.LastCount : 0,
          totalCapacity: info.TotalCapacity,
          isClosed: info.IsClosed,
        }
      })
      facilityInfos.sort((firstEl, secondEl) => {
        if (firstEl.name < secondEl.name)
          return -1
        else if (firstEl.name == secondEl.name)
          return 0
        return 1
      })
      console.log({ facilityInfos })
      let payload = {
        facilityInfos: facilityInfos,
        lastUpdatedTime: lastUpdatedTime,
        errorMessage: facilityInfos.length > 0 ? null : "No facility information found"
      }
      dispatch(
        facilityInfos.length > 0 ?
          gymSlice.actions.facilityInfosFetched(payload) :
          gymSlice.actions.facilityInfosFetchError(payload)
      )
    },
      (err) => {
        dispatch(gymSlice.actions.facilityInfosFetchError({
          lastUpdatedTime: new Date().toLocaleString(),
          errorMessage: err
        }))
      })
  }
}