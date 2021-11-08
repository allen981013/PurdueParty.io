import { Dispatch, Action } from 'redux';
import { RootState } from '..';
import { firebaseStorageRef } from '../..';

/*
    This function only needs to be called when updating the images for the dining courts. It's a manual process,
    but we can't access the URLs in the console. So we have to do it code wise here.
*/
export const placeDownloadURLS = () => {
    return (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
        //Manually call getDownloadURL for each dining court image and put it in the respective document
        const db = getFirestore();
        
        var collectionRef = db.collection("diningCourts");
        var storageRef = firebaseStorageRef;

        //Earhart
        storageRef.child('dining/Earhart.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Earhart").update({
                imageURL: url
            })
        })

        //Wiley
        storageRef.child('dining/Wiley.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Wiley").update({
                imageURL: url
            })
        })

        //Hillenbrand
        storageRef.child('dining/Hillenbrand.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Hillenbrand").update({
                imageURL: url
            })
        })

        //Ford
        storageRef.child('dining/Ford.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Ford").update({
                imageURL: url
            })
        })

        //Windsor
        storageRef.child('dining/Windsor.jpg').getDownloadURL().then((url) => {
            collectionRef.doc("Windsor").update({
                imageURL: url
            })
        })
    }
}

export const deleteStaleData = (diningCourt: string) => {
    return (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('diningCourts').doc(diningCourt);
        
        /**
         * var ref = firebase.database().ref('/path/to/items/');
            var now = Date.now();
            var cutoff = now - 2 * 60 * 60 * 1000;
            var old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
            var listener = old.on('child_added', function(snapshot) {
                snapshot.ref.remove();
            });
         */
    }
}

export const submitSurveyData = (diningInfo: any) => {
    return (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
        console.log(diningInfo);
        
        const db = getFirestore();
        var docref = db.collection('diningCourts').doc(diningInfo.diningCourt).collection('surveyData');

        docref.add({
            timestamp: Date.now(),
            rating: diningInfo.surveyResult
        }).then((newDocRef: any) => {
            dispatch({ type: 'SURVEY_SUBMITTED', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'SURVEY_ERR', err });
        });
    }
}