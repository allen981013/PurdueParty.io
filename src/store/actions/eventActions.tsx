import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';

// Need to explicitly define these types at some point
export const addEvent = (newEvent:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('events');

        docref.add({
            id: newEvent.id,
            ownerID: getState().firebase.auth.uid,
            editors: newEvent.editors,
            orgID: newEvent.orgID,
            title: newEvent.title,
            description: newEvent.description,
            location: newEvent.location,
            startTime: newEvent.startTime,
            endTime: newEvent.endTime,
            postedDateTime: Timestamp.now(),
            perks: newEvent.perks,
            categories: newEvent.categories,
            themes: newEvent.themes,
            attendees: newEvent.attendees,
        }).then((newDocRef:any) => {
            newDocRef.update({
                id: newDocRef.id
            })
            dispatch({ type: 'ADD_EVENT_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_EVENT_ERR', err});
        });
    }
}