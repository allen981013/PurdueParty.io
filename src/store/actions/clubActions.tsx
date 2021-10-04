import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';

// Need to explicitly define these types at some point
export const addClub = (newClub:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('clubs');
        docref.add({
            orgId: newClub.orgId,
            owner: getState().firebase.auth.uid,   
            editors: newClub.editors,
            title: newClub.title,
            description: newClub.description,
            contactInfo: newClub.contactInfo,
            postedDateTime: Timestamp.now(),
            attendees: newClub.attendees,
            category: newClub.category,
            event: newClub.event
        }).then((newDocRef:any) => {
            newDocRef.update({
                id: newDocRef.id
            })
            dispatch({ type: 'ADD_CLUB_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_CLUB_ERR', err});
        });
    }
}