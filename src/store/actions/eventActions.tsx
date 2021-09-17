import { Dispatch, Action } from 'redux';

// Need to explicitly define these types at some point
export const addEvent = (newEvent:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('events');
        docref.add({
            title: newEvent.title
        }).then((newDocRef:any) => {
            dispatch({ type: 'ADD_EVENT', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_EVENT_ERR', err});
        });
    }
}