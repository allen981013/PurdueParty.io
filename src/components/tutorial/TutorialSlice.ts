import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { Action, Dispatch } from 'redux'
import { RootState } from '../../store'

export interface PageVisitsInfo {
  classPage: boolean;
  classesPage: boolean;
  clubInfoPage: boolean;
  clubsPage: boolean;
  diningInfopage: boolean;
  diningsPage: boolean;
  eventInfoPage: boolean;
  eventsPage: boolean;
  forumHomePage: boolean;
  gymPage: boolean;
  homePage: boolean;
  marketplaceItemPage: boolean;
  marketplacePage: boolean;
  profilePage: boolean;
  threadPage: boolean;
  transportationPage: boolean;
}

// type for states returned by reducer
export interface TutorialReduxState {
  pageVisitsInfo: PageVisitsInfo,
}

// initial states
const initState: TutorialReduxState = {
  pageVisitsInfo: null,
}

// create slice
export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState: initState,
  reducers: {
    fetchPageVisitsInfoSuccess: (state: TutorialReduxState, action): TutorialReduxState => {
      return {
        ...state,
        pageVisitsInfo: action.payload.pageVisitInfo
      }
    },
  },
})

// actions

export const fetchPageVisitsInfo = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // Build queries
    const uid = getState().firebase.auth.uid
    const db: any = getFirestore();
    var pageVistsQueryPromise = db.collection("pageVisitsInfo")
      .where("userID", "==", uid)
    var pageVisitsQuerySnapshot = await pageVistsQueryPromise.get()
    // Transform raw data
    let rawInfo = pageVisitsQuerySnapshot.docs[0].data()
    let pageVisitsInfo: PageVisitsInfo = {
      classPage: rawInfo.classPage,
      classesPage: rawInfo.classesPage,
      clubInfoPage: rawInfo.clubInfoPage,
      clubsPage: rawInfo.clubsPage,
      diningInfopage: rawInfo.diningInfopage,
      diningsPage: rawInfo.diningsPage,
      eventInfoPage: rawInfo.eventInfoPage,
      eventsPage: rawInfo.eventsPage,
      forumHomePage: rawInfo.forumHomePage,
      gymPage: rawInfo.gymPage,
      homePage: rawInfo.homePage,
      marketplaceItemPage: rawInfo.marketplaceItemPage,
      marketplacePage: rawInfo.marketplacePage,
      profilePage: rawInfo.profilePage,
      threadPage: rawInfo.threadPage,
      transportationPage: rawInfo.transportationPage,
    }
    dispatch(tutorialSlice.actions.fetchPageVisitsInfoSuccess(pageVisitsInfo))
  }
}