import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';
import { firebaseStorageRef } from '../..';

// Need to explicitly define these types at some point
export const addClub = (newClub:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('clubs');


        docref.add({
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
                orgId: newDocRef.id
            })

            // Get default fireRef first
            var path = 'clubs/P.JPG'
            var fileRef = firebaseStorageRef.child(path);
            var fileType = '.png'
            var metadata = {
                contentType: 'image/png',
            };

             //put profile pic in firebase storage
             if (newClub.image != null as any || newClub.image != undefined) {
                 //configure metadata
                 if (newClub.image.type == 'image/jpeg' || newClub.image.type == 'image/jpg') {
                     metadata.contentType = 'image/jpeg'
                     fileType = '.jpeg'
                 }
                 else {
                     metadata.contentType = 'image/png'
                     fileType = '.png'
                 }
 
                 //create proper filename with user uid and path
                 path = 'clubs/' + newDocRef.id + fileType;
                 fileRef = firebaseStorageRef.child(path);
             }
             if (newClub.image != null as any) {
                 //upload to firebase storage
                 var waitOnUpload = fileRef.put(newClub.image, metadata)
 
                 //create image URL to store in Firestore
                 waitOnUpload.on('state_changed', (snapshot) => {
                 },
                     (error) => {
                         console.log('upload error')
                     },
                     () => {
                         fileRef.getDownloadURL().then((downloadURL) => {
                             //imageURL = downloadURL
                             newDocRef.update({
                                 image: downloadURL
                             })
                 
                         })
                     })
             } else {
                 fileRef = firebaseStorageRef.child('clubs/P.JPG');
                 fileRef.getDownloadURL().then((downloadURL) => {
                     newDocRef.update({
                         image: downloadURL
                     })
                 }) 
             }

            dispatch({ type: 'ADD_CLUB_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_CLUB_ERR', err});
        });
    }
}