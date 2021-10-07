import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { Timestamp } from 'firebase/firestore'
import { Description, TagSharp } from '@mui/icons-material'
import { GetDerivedStateFromError } from 'react'
import { RootState } from '../../store'
import { firebaseStorageRef } from '../..'
import { EventsFetchParameter } from './EventsLanding'

// type for states returned by reducer
export interface EventsLandingStatesRedux {
  events: {
    title: string,
    startTime: string,
    location: string,
    imageUrl: string,
    href: string,
    hostName: string
  }[];
  isEventsFetched: boolean;
  isLastPage: boolean;
}

// initial states
const initState: EventsLandingStatesRedux = {
  events: [],
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

// actions 

/* Uncomment this if we're storing image paths instead of image url in firestore */
export const fetchEvents = (fetchParameter: EventsFetchParameter) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    const db = getFirestore()
    const itemsPerPage = 12
    // Prepare events query 
    var queryEventsPromise = db.collection("events")
    queryEventsPromise = queryEventsPromise
      .where("startTime", ">=", Timestamp.fromDate(fetchParameter.startTimeLowerBound))
    if (fetchParameter.startTimeUpperBound) {
      queryEventsPromise = queryEventsPromise
        .where("startTime", "<", Timestamp.fromDate(fetchParameter.startTimeUpperBound))
    }
    queryEventsPromise = queryEventsPromise
      .orderBy("startTime","asc")
      .limit(fetchParameter.furthestPage * itemsPerPage + 1)  // request extra 1 doc to determine if it's the last page or not
      .get()
    // Create promises to create event objects
    var createEventPromisesPromise = queryEventsPromise.then((querySnapshot: any) => {
      return querySnapshot.docs.map(async (doc: any) => {
        if (doc.data().ownerID.length > 0) {
          var queryHostPromise = db.collection("users").doc(doc.data().ownerID).get()
        }
        else if (doc.data().orgID.length > 0) {
          // TODO: Query when host is a club when we've reached that user story
        }
        const hostDoc = await queryHostPromise
        return {
          title: doc.data().title,
          startTime: doc.data().startTime.toDate().toLocaleString("en-US"),
          location: doc.data().location,
          imageUrl: doc.data().image,
          href: "/events/" + doc.data().id,
          hostName: hostDoc.data().userName, // TODO: Cater to the case when the host is a club entity
        }
      })
    })
    createEventPromisesPromise.then((createEventPromises: any[]) => {
      Promise.all(createEventPromises).then((events: any) => {
        console.log(events)
        let payload = {
          events: events.slice(0, events.length),
          isLastPage: events.length <= fetchParameter.furthestPage * itemsPerPage,
        }
        dispatch(eventsLandingSlice.actions.eventsFetched(payload))
      })
    })
  }
}
