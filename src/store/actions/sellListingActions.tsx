import { Dispatch, Action } from 'redux';
import { addDoc, Timestamp } from '@firebase/firestore';
import { firebaseStorageRef } from '../..';


// Need to explicitly define these types at some point
export const addSellListing = (newSellListing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings');
        var imageURL = "";

        docref.add({
            owner: getState().firebase.auth.uid,
            title: newSellListing.title,
            description: newSellListing.description,
            postedDateTime: Timestamp.now(),
            type: newSellListing.type,
            price: newSellListing.price,
            contactInfo: newSellListing.contactInfo
        }).then((newDocRef: any) => {
            newDocRef.update({
                id: newDocRef.id
            })

            // Get default fireRef first
            var path = 'marketplace/P.JPG'
            var fileRef = firebaseStorageRef.child(path);
            var fileType = '.png'
            var metadata = {
                contentType: 'image/png',
            };

            //put profile pic in firebase storage
            if (newSellListing.image != null as any || newSellListing.image != undefined) {
                //configure metadata
                if (newSellListing.image.type == 'image/jpeg' || newSellListing.image.type == 'image/jpg') {
                    metadata.contentType = 'image/jpeg'
                    fileType = '.jpeg'
                }
                else {
                    metadata.contentType = 'image/png'
                    fileType = '.png'
                }

                //create proper filename with user uid and path
                path = 'marketplace/' + newDocRef.id + fileType;
                fileRef = firebaseStorageRef.child(path);
            }
            if (newSellListing.image != null as any) {
                //upload to firebase storage
                var waitOnUpload = fileRef.put(newSellListing.image, metadata)

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
                fileRef = firebaseStorageRef.child('marketplace/P.JPG');
                fileRef.getDownloadURL().then((downloadURL) => {
                    newDocRef.update({
                        image: downloadURL
                    })
                }) 
            }

            dispatch({ type: 'ADD_LISTING_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'ADD_LISTING_ERR', err });
        });
    }
}

//placeholder code
export const editSellListing = (newSellListing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings');
        var imageURL = "";

        docref.add({
            owner: getState().firebase.auth.uid,
            title: newSellListing.title,
            description: newSellListing.description,
            postedDateTime: Timestamp.now(),
            type: newSellListing.type,
            price: newSellListing.price,
            contactInfo: newSellListing.contactInfo
        }).then((newDocRef: any) => {
            newDocRef.update({
                id: newDocRef.id
            })

            // Get default fireRef first
            var path = 'marketplace/P.JPG'
            var fileRef = firebaseStorageRef.child(path);
            var fileType = '.png'
            var metadata = {
                contentType: 'image/png',
            };

            //put profile pic in firebase storage
            if (newSellListing.image != null as any || newSellListing.image != undefined) {
                //configure metadata
                if (newSellListing.image.type == 'image/jpeg' || newSellListing.image.type == 'image/jpg') {
                    metadata.contentType = 'image/jpeg'
                    fileType = '.jpeg'
                }
                else {
                    metadata.contentType = 'image/png'
                    fileType = '.png'
                }

                //create proper filename with user uid and path
                path = 'marketplace/' + newDocRef.id + fileType;
                fileRef = firebaseStorageRef.child(path);
            }
            if (newSellListing.image != null as any) {
                //upload to firebase storage
                var waitOnUpload = fileRef.put(newSellListing.image, metadata)

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
                fileRef = firebaseStorageRef.child('marketplace/P.JPG');
                fileRef.getDownloadURL().then((downloadURL) => {
                    newDocRef.update({
                        image: downloadURL
                    })
                }) 
            }

            dispatch({ type: 'ADD_LISTING_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'ADD_LISTING_ERR', err });
        });
    }
}

//placeholder code
export const deleteSellListing = (newSellListing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings');
        var imageURL = "";

        docref.add({
            owner: getState().firebase.auth.uid,
            title: newSellListing.title,
            description: newSellListing.description,
            postedDateTime: Timestamp.now(),
            type: newSellListing.type,
            price: newSellListing.price,
            contactInfo: newSellListing.contactInfo
        }).then((newDocRef: any) => {
            newDocRef.update({
                id: newDocRef.id
            })

            // Get default fireRef first
            var path = 'marketplace/P.JPG'
            var fileRef = firebaseStorageRef.child(path);
            var fileType = '.png'
            var metadata = {
                contentType: 'image/png',
            };

            //put profile pic in firebase storage
            if (newSellListing.image != null as any || newSellListing.image != undefined) {
                //configure metadata
                if (newSellListing.image.type == 'image/jpeg' || newSellListing.image.type == 'image/jpg') {
                    metadata.contentType = 'image/jpeg'
                    fileType = '.jpeg'
                }
                else {
                    metadata.contentType = 'image/png'
                    fileType = '.png'
                }

                //create proper filename with user uid and path
                path = 'marketplace/' + newDocRef.id + fileType;
                fileRef = firebaseStorageRef.child(path);
            }
            if (newSellListing.image != null as any) {
                //upload to firebase storage
                var waitOnUpload = fileRef.put(newSellListing.image, metadata)

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
                fileRef = firebaseStorageRef.child('marketplace/P.JPG');
                fileRef.getDownloadURL().then((downloadURL) => {
                    newDocRef.update({
                        image: downloadURL
                    })
                }) 
            }

            dispatch({ type: 'ADD_LISTING_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'ADD_LISTING_ERR', err });
        });
    }
}