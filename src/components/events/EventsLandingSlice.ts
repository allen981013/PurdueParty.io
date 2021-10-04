import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { Timestamp } from 'firebase/firestore'
import { Description, TagSharp } from '@mui/icons-material'
import { GetDerivedStateFromError } from 'react'
import { RootState } from '../../store'

// type for states returned by reducer
export interface EventsLandingStatesRedux {
  events: {
    title: string,
    startTime: string,
    location: string,
    imageUrl: string,
    href: string
  }[];
  isEventsFetched: boolean;
  isLastPage: boolean;
}

// initial states
const initState: EventsLandingStatesRedux = {
  events: [],
  // {
  //   title: "My Event",
  //   startTime: new Date().toLocaleString("en-US"),
  //   location: "Purdue University",
  //   imageUrl: "https://firebasestorage.googleapis.com/v0/b/purdueparty-44444.appspot.com/o/events%2Fdefault.jpg?alt=media&token=1b1656e4-8f07-4f31-8f29-49a5f50bbe7c",
  //   href: "/events"
  // },
  isEventsFetched: false,
  isLastPage: true,
}

// create slice
export const eventsLandingSlice = createSlice({
  name: 'eventsLanding',
  initialState: initState,
  reducers: {
    eventsFetched: (state: EventsLandingStatesRedux, action): EventsLandingStatesRedux => {
      return {
        ...state,
        events: action.payload.events,
        isLastPage: action.payload.isLastPage,
        isEventsFetched: true,
      }
    },
    eventsNotFound: (state: EventsLandingStatesRedux): EventsLandingStatesRedux => {
      return {
        ...state,
        events: [],
        isEventsFetched: true,
        isLastPage: true,
      }
    }
  },
})

export const fetchEventsAtNextPage = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    const state = getState()
    const db = getFirestore()
    console.log({state})
    // var eventsQueryPromise = db.collection("events")
    //   .where("startTime", ">", Timestamp.now())
    //   .orderBy("startTime").limit(9)
    //   .get().then((querySnapshot: any) => {
    //     querySnapshot.forEach((doc: any) => {
    //     }
    //   }
  }
}

// actions
export const fetchEventInfo = (eventID: string) => {
  /**
   * Read db content for event information and populate the store through the reducer.
   */
  return async (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
    const db = getFirestore()
    // Query event info
    // db.collection("events").doc(eventID).get()
    //   .then((doc: any) => {
    //     // Return if event not found
    //     if (doc.data() === undefined) {
    //       dispatch(eventInfoSlice.actions.eventsNotFound())
    //       return
    //     }
    //     // Map event info
    //     var title = doc.data().title
    //     var startTime = doc.data().startTime.toDate().toLocaleString("en-US")
    //     var endTime = doc.data().endTime.toDate().toLocaleString("en-US")
    //     var location = doc.data().location
    //     var description = doc.data().description
    //     var categories = doc.data().categories
    //     var perks = doc.data().perks
    //     var imageUrl = doc.data().imageUrl
    //     var hostID = doc.data().hostID
    //     var hostType = doc.data().hostType
    //     var hostName: string | undefined = undefined
    //     var hostHref: string | undefined = undefined
    //     // Query host info
    //     if (hostType == "USER") {
    //       var hostQueryPromise = db.collection("users").doc(hostID).get()
    //         .then((userDoc: any) => {
    //           // Map host info 
    //           hostName = userDoc.data().userName
    //           hostHref = "/users/" + hostName
    //         })
    //     }
    //     else if (hostType == "CLUB") {
    //       // TODO: Finish this once club info has been created
    //     }
    //     // Create payload and dispatch
    //   //   Promise.all([hostQueryPromise])
    //   //     .then(() => {
    //   //       type PayloadType = {
    //   //         events: EventsLandingStatesRedux["events"],
    //   //       }
    //   //       const payload = {
    //   //         event: {
    //   //           title: title,
    //   //           startTime: startTime,
    //   //           endTime: endTime,
    //   //           location: location,
    //   //           description: description,
    //   //           tags: categories,
    //   //           imageUrl: imageUrl,
    //   //           perks: perks,
    //   //           categories: categories,
    //   //         },
    //   //         host: {
    //   //           name: hostName,
    //   //           href: hostHref,
    //   //         }
    //   //       }
    //   //       dispatch(eventInfoSlice.actions.eventsFetched(payload))
    //   //     });
    //   });
  }
}