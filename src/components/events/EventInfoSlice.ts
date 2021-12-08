import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { Timestamp } from 'firebase/firestore'
import { Description, TagSharp } from '@mui/icons-material'
import { firebaseStorageRef } from '../..'
import moment from 'moment'

// type for states returned by reducer
export interface EventInfoStatesRedux {
  event: {
    id: string,
    title: string,
    ownerID: string,
    editors: string[],
    startTime: string,
    duration: string,
    endTime: string,
    location: string,
    description: string,
    categories: string[],
    perks: string[],
    imageUrl: string,
    attendees: string[],
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
    id: "",
    title: "My Event",
    ownerID: "",
    editors: [],
    startTime: new Date().toLocaleString("en-US"),
    endTime: new Date().toLocaleString("en-US"),
    duration: "",
    location: "Purdue University",
    description: "This is my event description",
    categories: ["social", "event"],
    perks: ["Free food"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/purdueparty-44444.appspot.com/o/events%2Fdefault.jpg?alt=media&token=1b1656e4-8f07-4f31-8f29-49a5f50bbe7c",
    attendees: [""],
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
    },
    rsvpSuccess: (state: EventInfoStatesRedux, action): EventInfoStatesRedux => {
      let uid = action.payload
      console.log("rsvp", uid)
      console.log("attendees", state.event.attendees)
      return {
        ...state,
        event: {
          ...state.event,
          attendees: state.event.attendees.concat([uid])
        }
      }
    },
    rsvpRemoveSuccess: (state: EventInfoStatesRedux, action): EventInfoStatesRedux => {
      let uid = action.payload
      console.log({uid})
      return {
        ...state,
        event: {
          ...state.event,
          attendees: state.event.attendees.filter(attendee => attendee != uid)
        }
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
        var id = doc.data().id
        var title = doc.data().title
        var ownerID = doc.data().ownerID
        var editors = doc.data().editors
        var startTime = doc.data().startTime.toDate().toLocaleString("en-US")
        var endTime = doc.data().endTime.toDate().toLocaleString("en-US")
        var location = doc.data().location
        var duration = moment.duration(
          moment(doc.data().endTime.toDate())
          .diff(doc.data().startTime.toDate())
        ).humanize()
        var description = doc.data().description
        var categories = doc.data().categories
        var perks = doc.data().perks
        var orgID = doc.data().orgID
        var imageUrl = doc.data().image
        var attendees = doc.data().attendees
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
        // Create payload and dispatch
        Promise.all([hostQueryPromise])
          .then(() => {
            type PayloadType = {
              event: EventInfoStatesRedux["event"],
              host: EventInfoStatesRedux["host"]
            }
            const payload = {
              event: {
                id: id,
                title: title,
                ownerID: ownerID,
                editors: editors,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                location: location,
                description: description,
                tags: categories,
                imageUrl: imageUrl,
                perks: perks,
                categories: categories,
                attendees: attendees,
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