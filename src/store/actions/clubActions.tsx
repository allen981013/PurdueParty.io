import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';
import { firebaseStorageRef } from '../..';

// Need to explicitly define these types at some point
export const addClub = (newClub: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
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
            events: newClub.events
        }).then((newDocRef: any) => {
            newDocRef.update({
                orgId: newDocRef.id
            })

            // For each editor in the editors arr
            for (let i = 0; i < newClub.editors.length; i++) {
                // Get the editor object
                db.collection("users").doc(newClub.editors[i]).get().then(function (doc: any) {
                    // If user object exists
                    if (doc.exists) {
                        console.log("Document data:", doc.data());

                        // Create copy of canEditClubs arr to append new clubID onto
                        var canEditClubs = doc.data().canEditClubs;
                        canEditClubs.push(newDocRef.id);

                        // Edit the user object
                        db.collection('users').doc(newClub.editors[i]).update({
                            canEditClubs: canEditClubs,
                        })
                        // If user doesn't exist...
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function (error: any) {
                    console.log("Error getting document:", error);
                });
            };

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
        }).catch((err: any) => {
            dispatch({ type: 'ADD_CLUB_ERR', err });
        });
    }
}


export const editClub = (editedClub: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        // Get database
        const db = getFirestore();

        // Get that club document
        var docref = db.collection('clubs').doc(editedClub.orgId);

        console.log("WE ARE NOW IN EDITCLUB")
        console.log(editedClub)

        // Modify the club object
        var checkUsername = docref.get().then((querySnapshot: any) => {
            // Update the club object with the state variables from editClubPage
            docref.update({
                owner: getState().firebase.auth.uid,
                orgId: editedClub.orgId,
                editors: editedClub.editors,
                title: editedClub.title,
                description: editedClub.description,
                contactInfo: editedClub.contactInfo,
                postedDateTime: editedClub.postedDateTime,
                attendees: editedClub.attendees,
                category: editedClub.category,
                events: editedClub.events
            }).then(() => {
                // Get default fireRef first
                var path = 'clubs/P.JPG'
                var fileRef = firebaseStorageRef.child(path);
                var fileType = '.png'
                var metadata = {
                    contentType: 'image/png',
                };

                //put profile pic in firebase storage
                if (editedClub.image != null as any || editedClub.image != undefined) {
                    //configure metadata
                    if (editedClub.image.type == 'image/jpeg' || editedClub.image.type == 'image/jpg') {
                        metadata.contentType = 'image/jpeg'
                        fileType = '.jpeg'
                    }
                    else {
                        metadata.contentType = 'image/png'
                        fileType = '.png'
                    }

                    //create proper filename with user uid and path
                    path = 'clubs/' + editedClub.orgId + fileType;
                    fileRef = firebaseStorageRef.child(path);
                }

                if (editedClub.image != null as any) {
                    //upload to firebase storage
                    var waitOnUpload = fileRef.put(editedClub.image, metadata)

                    //create image URL to store in Firestore
                    waitOnUpload.on('state_changed', (snapshot) => {
                    },
                        (error) => {
                            console.log('upload error')
                        },
                        () => {
                            fileRef.getDownloadURL().then((downloadURL) => {
                                //imageURL = downloadURL
                                docref.update({
                                    image: downloadURL
                                }).then((docref: any) => {
                                    dispatch({ type: 'UPDATE_CLUB_SUCCESS', docref });
                                }).catch((err: any) => {
                                    dispatch({ type: 'UPDATE_CLUB_ERR', err });
                                });
                            })
                        })
                } 

                console.log("Club Edit Successfully!");
                dispatch({ type: 'EDIT_CLUB_SUCCESS' })
            });
        });
    }
}