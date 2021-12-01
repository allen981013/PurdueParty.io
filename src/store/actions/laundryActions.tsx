import { Dispatch, Action } from 'redux';
import { RootState } from '..';
import { firebaseStorageRef } from '../..';

/*
    This function only needs to be called when updating the images for the laundry locations. It's a manual process,
    but we can't access the URLs in the console. So we have to do it code wise here.
*/
export const placeDownloadURLS = () => {
    return (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
        //Manually call getDownloadURL for each laundry image and put it in the respective document
        const db = getFirestore();

        var collectionRef = db.collection("laundry");
        var storageRef = firebaseStorageRef;

        //Earhart
        storageRef.child('laundry/Earhart.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Earhart").update({
                imageURL: url
            })
        })

        //Wiley
        storageRef.child('laundry/Wiley.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Wiley").update({
                imageURL: url
            })
        })

        //Hillenbrand
        storageRef.child('laundry/Hillenbrand.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Hillenbrand").update({
                imageURL: url
            })
        })

        //Hawkins
        storageRef.child('laundry/Hawkins.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Hawkins").update({
                imageURL: url
            })
        })

        //Windsor
        storageRef.child('laundry/Windsor.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Windsor").update({
                imageURL: url
            })
        })

        //HonorsNorth
        storageRef.child('laundry/HonorsNorth.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("HonorsNorth").update({
                imageURL: url
            })
        })

        //HonorsSouth
        storageRef.child('laundry/HonorsSouth.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("HonorsSouth").update({
                imageURL: url
            })
        })

        //Shreve
        storageRef.child('laundry/Shreve.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Shreve").update({
                imageURL: url
            })
        })
    }
}

export const deleteStaleData = (laundry: string) => {
    return (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var ref = db.collection('laundry').doc(laundry).collection('surveyData');
        var now = Date.now();
        var old = ref.orderBy('timestamp', 'desc');
        old.get().then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
                //console.log(doc.id, " => ", doc.data());
                const milliseconds = Math.abs(now - doc.data().timestamp);
                const hours = milliseconds / 36e5;
                if (hours >= 1) {
                    ref.doc(doc.id).delete();
                }
            });
        });
    }
}

export const submitSurveyData = (laundryInfo: any) => {
    return (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
        console.log(laundryInfo);

        const db = getFirestore();
        var docref = db.collection('laundry').doc(laundryInfo.laundry).collection('surveyData');

        docref.add({
            timestamp: Date.now(),
            rating: laundryInfo.surveyResult
        }).then((newDocRef: any) => {
            dispatch({ type: 'SURVEY_SUBMITTED', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'SURVEY_ERR', err });
        });
    }
}