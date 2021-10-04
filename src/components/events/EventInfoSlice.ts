import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { Timestamp } from 'firebase/firestore'
import { Description, TagSharp } from '@mui/icons-material'
import { firebaseStorageRef } from '../..'

// type for states returned by reducer
export interface EventInfoStatesRedux {
  event: {
    title: string,
    startTime: string,
    endTime: string,
    location: string,
    description: string,
    categories: string[],
    perks: string[],
    imageUrl: string,
  },
  host: {
    name: string,
    href: string,
  }
  hasInfoFetched: boolean,
  eventNotFound: boolean,
}

// initial states
const initState: EventInfoStatesRedux = {
  event: {
    title: "My Event",
    startTime: new Date().toLocaleString("en-US"),
    endTime: new Date().toLocaleString("en-US"),
    location: "Purdue University",
    description: "This is my event description",
    categories: ["social", "event"],
    perks: ["Free food"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/purdueparty-44444.appspot.com/o/events%2Fdefault.jpg?alt=media&token=1b1656e4-8f07-4f31-8f29-49a5f50bbe7c",
  },
  host: {
    name: "My name",
    href: "/",
  },
  hasInfoFetched: false,
  eventNotFound: false,
}

// create slice
export const eventInfoSlice = createSlice({
  name: 'eventInfo',
  initialState: initState,
  reducers: {
    newEventInfoRequested: (state: EventInfoStatesRedux): EventInfoStatesRedux => {
      return {
        ...state,
        hasInfoFetched: false,
        eventNotFound: false,
      }
    },
    eventInfoFetched: (state: EventInfoStatesRedux, action): EventInfoStatesRedux => {
      return {
        ...state,
        event: action.payload.event,
        host: action.payload.host,
        hasInfoFetched: true,
        eventNotFound: false,
      }
    },
    eventInfoNotFound: (state: EventInfoStatesRedux): EventInfoStatesRedux => {
      return {
        ...state,
        hasInfoFetched: true,
        eventNotFound: true,
      }
    }
  },
})

// actions
export const fetchEventInfo = (eventID: string) => {
  /**
   * Read db content for event information and populate the store through the reducer.
   */
  return async (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
    dispatch(eventInfoSlice.actions.newEventInfoRequested())
    const db = getFirestore()
    // Query event info
    db.collection("events").doc(eventID).get()
      .then((doc: any) => {
        // Return if event not found
        if (doc.data() === undefined) {
          dispatch(eventInfoSlice.actions.eventInfoNotFound())
          return
        }
        // Map event info
        var title = doc.data().title
        var startTime = doc.data().startTime.toDate().toLocaleString("en-US")
        var endTime = doc.data().endTime.toDate().toLocaleString("en-US")
        var location = doc.data().location
        var description = doc.data().description
        var categories = doc.data().categories
        var perks = doc.data().perks
        var ownerID = doc.data().ownerID
        var orgID = doc.data().orgID
        var imagePath = doc.data().imagePath
        // Query host info
        var hostName: string | undefined = undefined
        var hostHref: string | undefined = undefined
        if (ownerID.length != 0) {
          var hostQueryPromise = db.collection("users").doc(ownerID).get()
            .then((userDoc: any) => {
              // Map host info 
              hostName = userDoc.data().userName
              hostHref = "/users/" + hostName
            })
        }
        else if (orgID.length != 0) {
          // TODO: Finish this once club info has been created
        }
        // Query image url
        var imageUrl = ""
        var imageUrlQueryPromise = firebaseStorageRef.child(imagePath).getDownloadURL()
          .then((url) => {
            imageUrl = url
          })
        // Create payload and dispatch
        Promise.all([hostQueryPromise, imageUrlQueryPromise])
          .then(() => {
            type PayloadType = {
              event: EventInfoStatesRedux["event"],
              host: EventInfoStatesRedux["host"]
            }
            const payload = {
              event: {
                title: title,
                startTime: startTime,
                endTime: endTime,
                location: location,
                description: description,
                tags: categories,
                imageUrl: imageUrl,
                perks: perks,
                categories: categories,
              },
              host: {
                name: hostName,
                href: hostHref,
              }
            }
            dispatch(eventInfoSlice.actions.eventInfoFetched(payload))
          });
      });
  }
}