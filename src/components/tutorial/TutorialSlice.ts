import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { toast } from 'react-toastify';
import { Action, Dispatch } from 'redux'
import { store } from '../..';
import { RootState } from '../../store'

export interface PageVisitInfo {
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
  pageVisitInfo: PageVisitInfo,
}

// initial states
const initState: TutorialReduxState = {
  pageVisitInfo: null,
}

// create slice
export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState: initState,
  reducers: {
    fetchPageVisitInfoSuccess: (state: TutorialReduxState, action): TutorialReduxState => {
      return {
        ...state,
        pageVisitInfo: action.payload,
      }
    },
    setPageVisitInfoSuccess: (state: TutorialReduxState, action): TutorialReduxState => {
      return {
        ...state,
        pageVisitInfo: action.payload
      }
    },
    updatePageVisitInfoSuccess: (state: TutorialReduxState, action): TutorialReduxState => {
      return {
        ...state,
        pageVisitInfo: action.payload
      }
    },
  },
})

// actions

export const fetchPageVisitInfo = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // Build queries
    const uid = getState().firebase.auth.uid
    const db: any = getFirestore();
    var docRef = db.collection("pageVisitInfo").doc(uid)
    docRef.get()
      .then((docSnapshot: any) => {
        if (!docSnapshot.exists) {
          store.dispatch(setPageVisitInfo())
          return;
        }
        let rawInfo = docSnapshot.data()
        let pageVisitInfo: PageVisitInfo = {
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
        console.log({ rawInfo })
        dispatch(tutorialSlice.actions.fetchPageVisitInfoSuccess(pageVisitInfo))
      }).catch((error: any) => {
        toast.error(error.message)
      })
  }
}

export const setPageVisitInfo = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    const db = getFirestore()
    const state = getState()
    let pageVisitInfo: PageVisitInfo = {
      classPage: false,
      classesPage: false,
      clubInfoPage: false,
      clubsPage: false,
      diningInfopage: false,
      diningsPage: false,
      eventInfoPage: false,
      eventsPage: false,
      forumHomePage: false,
      gymPage: false,
      homePage: false,
      marketplaceItemPage: false,
      marketplacePage: false,
      profilePage: false,
      threadPage: false,
      transportationPage: false,
    }
    db.collection("pageVisitInfo")
      .doc(state.firebase.auth.uid)
      .set(
        pageVisitInfo
      ).then(() => {
        dispatch(tutorialSlice.actions.setPageVisitInfoSuccess(pageVisitInfo))
      }
      ).catch(() => {
        toast.error("Error when setting the user's page visit info")
      })
  }
}

export const updatePageVisitInfo = (newPageVisitInfo: PageVisitInfo) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    const db = getFirestore()
    const state = getState()
    var docRef = db.collection("pageVisitInfo").doc(state.firebase.auth.uid);
    docRef.get()
      .then((docSnapshot: any) => {
        if (docSnapshot.exists) {
          docRef.update(newPageVisitInfo)
            .then(() => {
              dispatch(tutorialSlice.actions.updatePageVisitInfoSuccess(newPageVisitInfo))
            }).catch((error: any) => {
              toast.error(error.message)
            })
        }
        else {
          toast.error("Cannot update page visit info (document does not exists)")
        }
      })
      .catch(function (error: any) {
        toast.error(error.message);
      });

  }
}
