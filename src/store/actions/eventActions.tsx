import { collection, getDocs, addDoc, doc } from 'firebase/firestore';
import { Dispatch, Action } from 'redux';

/*
export const getEvents = () => {
    return(dispatch : Dispatch<Action>, getFirestore : () => any ) => {
        const firestore = getFirestore();
        const querySnapshot = getDocs(collection(firestore, "events")).then(() => {
            dispatch({ type: 'RETRIEVE_EVENTS'});
        }).catch((err) => {
            dispatch({ type: 'RETRIEVE_EVENTS_ERR'});
        });
    }
}
*/

export const addEvent = (event:any) => {
    return(dispatch : Dispatch<Action>, getFirestore : () => any ) => {
        const db = getFirestore();
        const querySnapshot = addDoc(collection(db, "events"), {
            title: event.title
        }).then(() => {
            dispatch({ type: 'ADD_EVENT'});
        }).catch((err) => {
            dispatch({ type: 'ADD_EVENT_ERR'});
        });
    }
}