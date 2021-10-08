import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';
import { firebaseStorageRef } from '../..';
import { authIsReady } from 'react-redux-firebase';

// Need to explicitly define these types at some point
export const addEvent = (newEvent:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('events');

        docref.add({
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

            // Get default fireRef first
            var path = 'events/default.jpg'
            var fileRef = firebaseStorageRef.child(path);
            var fileType = '.png'
            var metadata = {
                contentType: 'image/png',
            };

            //put profile pic in firebase storage
            if (newEvent.image != null as any || newEvent.image != undefined) {
                //configure metadata
                if (newEvent.image.type == 'image/jpeg' || newEvent.image.type == 'image/jpg') {
                    metadata.contentType = 'image/jpeg'
                    fileType = '.jpeg'
                }
                else {
                    metadata.contentType = 'image/png'
                    fileType = '.png'
                }

                //create proper filename with user uid and path
                path = 'events/' + newDocRef.id + fileType;
                fileRef = firebaseStorageRef.child(path);
            }
            if (newEvent.image != null as any) {
                //upload to firebase storage
                var waitOnUpload = fileRef.put(newEvent.image, metadata)

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
                fileRef = firebaseStorageRef.child('events/default.jpg');
                fileRef.getDownloadURL().then((downloadURL) => {
                    newDocRef.update({
                        image: downloadURL
                    })
                }) 
            }

            dispatch({ type: 'ADD_EVENT_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_EVENT_ERR', err});
        });
    }
}

export const editEvent = (newEvent: any) =>{
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('events').doc();
        docref.update({
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
            attendees: newEvent.attendees
        });
    }
}