import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { Timestamp } from 'firebase/firestore'

// type for states returned by reducer
export interface LandingStatesRedux {
    events: {
        title: string;
        href: string;
        time: string;
    }[],
    saleItems: {
        title: string;
        href: string;
        price: string;
    }[],
    classes: {
        title: string;
        href: string;
    }[],
    clubs: {
        title: string;
        href: string;
    }[]
}

// initial states
const initState: LandingStatesRedux = {
    events: [],
    saleItems: [],
    classes: [],
    clubs: [],
}

// create slice
export const landing = createSlice({
    name: 'landing',
    initialState: initState,
    reducers: {
        landingPageContentLoaded: (state: LandingStatesRedux, action) => {
            return {
                ...state,
                events: action.payload.events,
                classes: action.payload.classes,
                clubs: action.payload.clubs,
                saleItems: action.payload.saleItems,
            }
        },
    },
})

// actions 
export const loadLandingPageContent = () => {
    /**
     * Read db content for events, marketplace, classes, and clubs data and 
     * populate the store through the reducer.
     */
    return async (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore()
        const itemLimit = 5
        var payload: LandingStatesRedux = { events: [], classes: [], clubs: [], saleItems: [] }
        var eventsQueryPromise = db.collection("events")
        .where("startTime", ">", Timestamp.now())
        .orderBy("startTime").limit(itemLimit)
        .get().then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
                let rawTime = new Date(doc.data().startTime.seconds * 1000)
                let today = new Date()
                let isToday = (rawTime.getDate() == today.getDate())
                    && (rawTime.getMonth() == today.getMonth())
                    && (rawTime.getFullYear() == today.getFullYear())
                var time = ""
                if (isToday) {
                    let localeTimeStr = rawTime.toLocaleTimeString()  // format: H?H:MM:SS A/PM
                    let meridiem = localeTimeStr.split(" ")[1].toLowerCase()
                    let localeTimeArr = rawTime.toLocaleTimeString("en-US").split(":")
                    let hours = localeTimeArr[0]
                    let minutes = localeTimeArr[1]
                    time = hours + ":" + minutes + meridiem
                }
                else {
                    let localeDateStr = rawTime.toLocaleDateString()  // format: M?M/D?D/YY ...
                    let localeDateArr = localeDateStr.split("/")
                    time = localeDateArr[0] + "/" + localeDateArr[1]
                }
                payload.events.push({
                    title: doc.data().title,
                    href: "/events/" + doc.id,
                    time: time,
                })
            });
        });
        var saleItemsQueryPromise = db.collection("marketplace").limit(itemLimit).get().then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
                payload.saleItems.push({
                    title: doc.data().title,
                    href: "/marketplace/" + doc.id,
                    price: "$" + parseFloat(doc.data().price).toFixed(2),
                })
            });
        });
        var clubsQueryPromise = db.collection("clubs").limit(itemLimit).get().then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
                payload.clubs.push({
                    title: doc.data().title,
                    href: "/clubs/" + doc.id,
                })
            });
        });
        var classesQueryPromise = db.collection("classes").limit(itemLimit).get().then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
                payload.classes.push({
                    title: doc.data().title,
                    href: "/classes/" + doc.id,
                })
            });
        });
        Promise.all([eventsQueryPromise, saleItemsQueryPromise, clubsQueryPromise, classesQueryPromise])
            .then(() => {
                dispatch(landing.actions.landingPageContentLoaded(payload))
            });
    }
}
