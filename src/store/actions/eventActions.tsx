import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';
import { firebaseStorageRef } from '../..';
import { authIsReady } from 'react-redux-firebase';
import { valueContainerCSS } from 'react-select/dist/declarations/src/components/containers';
import { deleteFromStorage } from './authActions'

// Need to explicitly define these types at some point
export const addEvent = (newEvent: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
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
        }).then((newDocRef: any) => {
            newDocRef.update({
                id: newDocRef.id
            })

            // If the event is part of a club, attach the eventID to the club
            if (!(newEvent.orgID == "")) {

                // Get the club object that the event is for
                var docRef = db.collection("clubs").doc(newEvent.orgID).get().then(function (doc: any) {
                    if (doc.exists) {
                        // make temp array to with curr values and append new ID to it
                        var clubEvents = doc.data().events
                        clubEvents.push(newDocRef.id)

                        // Update the events array for the club with the new event
                        db.collection('clubs').doc(newEvent.orgID).update({
                            events: clubEvents
                        })

                        // Update the editors array
                        newDocRef.update({
                            editors: doc.data().editors
                        })
                    }
                }).catch(function (error: any) {
                    console.log("Error getting document:", error);
                });
            };

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
        }).catch((err: any) => {
            dispatch({ type: 'ADD_EVENT_ERR', err });
        });
    }
}

export const editEvent = (newEvent: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        console.log(newEvent.id);
        var docref = db.collection('events').doc(newEvent.id);

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
        }).then(() => {
            dispatch({ type: 'EDIT_EVENT_SUCCESS' });
        });
    }
}

// eventToDelete is just an ID
export const deleteEvent = (eventToDelete: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();

        // Get the event object
        var eventDocRef = db.collection("events").doc(eventToDelete);

        // With that event object...
        eventDocRef.get().then(function (doc: any) {
            // delete event pic from storage
            deleteFromStorage('profilePics/' + doc.data().id);

            // Get the club object to remove eventID from events arr if orgID is not blank
            if (doc.data().orgID != "") {
                var clubDocRef = db.collection('clubs').doc(doc.data().orgID);

                // Get the club object
                clubDocRef.get().then(function (clubDoc: any) {

                    // Create copy of canEditClubs arr to append new clubID onto
                    var events = clubDoc.data().events;
                    events.splice(events.indexOf(doc.data().id), 1);

                    clubDocRef.update({
                        events: events,
                    })
                }).catch(function (error: any) {
                    console.log("Error getting document:", error);
                });
            }
            // delete the event
            eventDocRef.delete().then(() => {
                dispatch({ type: 'DELETE_EVENT_SUCCESS'})
            }).catch((err: any) => {
                dispatch({ type: 'DELETE_EVENT_ERROR', err })
            });;
        })
    }
}