import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';

// Need to explicitly define these types at some point
export const addSellListing = (newSellListing:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('sellListings');
        docref.add({
            id: newSellListing.id,
            owner: getState().firebase.auth.uid,
            title: newSellListing.title,
            description: newSellListing.description,
            postedDateTime: Timestamp.now(),
            type: newSellListing.type,
            image: newSellListing.image,
            price: newSellListing.price,
            contactInfo: newSellListing.contactInfo
        }).then((newDocRef:any) => {
            dispatch({ type: 'ADD_LISTING_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_LISTING_ERR', err});
        });
    }
}