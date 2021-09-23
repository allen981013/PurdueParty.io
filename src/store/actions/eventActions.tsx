import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';

// Need to explicitly define these types at some point
export const addEvent = (newEvent:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('events');

        docref.add({
            id: newEvent.id,
            owner: newEvent.owner,
            editors: newEvent.editors,
            orgID: newEvent.orgID,
            title: newEvent.title,
            description: newEvent.description,
            location: newEvent.location,
            dateTime: newEvent.dateTime,
            postedDateTime: Timestamp.now(),
            attendees: newEvent.attendees,
            type: newEvent.type
        }).then((newDocRef:any) => {
            dispatch({ type: 'ADD_EVENT_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_EVENT_ERR', err});
        });
    }
}