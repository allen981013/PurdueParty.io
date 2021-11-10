import { Dispatch, Action } from 'redux';
import { addDoc, Timestamp } from '@firebase/firestore';
import { firebaseStorageRef } from '../..';


export const messageListingOwner = (senderID: string, receiverID: string, listingID: string, message: string) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();
        var docref = db.collection('users').doc(receiverID);

        var newMarketMessagesArr: { senderID: string; listingID: string, message: string; }[];
        newMarketMessagesArr = []

        docref.get().then((doc: any) => {
            var marketMessages
            if (marketMessages = doc.data().marketMessages) {
                newMarketMessagesArr = marketMessages
                let index = newMarketMessagesArr.findIndex(element => element.senderID === senderID)
                
                if(index != -1){
                    window.alert("Message not sent, you have already sent the owner a message about this listing. Navigate to your profile page to check for a reply")
                    dispatch({ type: 'CREATE_MESSAGE_SUCCESS', doc });
                    return
                }
                newMarketMessagesArr[newMarketMessagesArr.length] = {
                    senderID: senderID,
                    listingID: listingID,
                    message: message,
                }
            } else {
                newMarketMessagesArr[0] = {
                    senderID: senderID,
                    listingID: listingID,
                    message: message,
                }
            }
            
            docref.set({
                marketMessages: newMarketMessagesArr
            }, { merge: true }).then((newDocRef: any) => {
                window.alert("Message successfully sent!")
                dispatch({ type: 'CREATE_MESSAGE_SUCCESS', newDocRef });
            }).catch((err: any) => {
                dispatch({ type: 'CREATE_MESSAGE_ERR', err });
            });
        }).catch((err: any) => {
            console.log("error getting user doc likes dislkikes");
            dispatch({ type: 'CREATE_MESSAGE_ERR', err });
        });

    }
}

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

export const editListingTitle = (listing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings').doc(listing.id);

        docref.update({
            title: listing.title
        }).then((newDocRef: any) => {
            dispatch({ type: 'UPDATE_LISTING_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'UPDATE_LISTING_ERR', err });
        });
    }
}

export const editListingDescription = (listing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        console.log(listing);
        var docref = db.collection('sellListings').doc(listing.id);

        docref.update({
            description: listing.description
        }).then((newDocRef: any) => {
            dispatch({ type: 'UPDATE_LISTING_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'UPDATE_LISTING_ERR', err });
        });
    }
}


export const editListingPrice = (listing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings').doc(listing.id);

        docref.update({
            price: listing.price
        }).then((newDocRef: any) => {
            dispatch({ type: 'UPDATE_LISTING_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'UPDATE_LISTING_ERR', err });
        });
    }
}

export const editListingType = (listing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings').doc(listing.id);

        docref.update({
            type: listing.type
        }).then((newDocRef: any) => {
            dispatch({ type: 'UPDATE_LISTING_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'UPDATE_LISTING_ERR', err });
        });
    }
}

export const editListingContact = (listing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings').doc(listing.id);

        docref.update({
            contactInfo: listing.contactInfo
        }).then((newDocRef: any) => {
            dispatch({ type: 'UPDATE_LISTING_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'UPDATE_LISTING_ERR', err });
        });
    }
}

export const editListingImage = (listing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings').doc(listing.id);

        // Get default fireRef first
        var path = 'marketplace/P.JPG'
        var fileRef = firebaseStorageRef.child(path);
        var fileType = '.png'
        var metadata = {
            contentType: 'image/png',
        };

        //put profile pic in firebase storage
        if (listing.image != null as any || listing.image != undefined) {
            //configure metadata
            if (listing.image.type == 'image/jpeg' || listing.image.type == 'image/jpg') {
                metadata.contentType = 'image/jpeg'
                fileType = '.jpeg'
            }
            else {
                metadata.contentType = 'image/png'
                fileType = '.png'
            }

            //create proper filename with user uid and path
            path = 'marketplace/' + docref.id + fileType;
            fileRef = firebaseStorageRef.child(path);
        }

        if (listing.image != null as any) {
            //upload to firebase storage
            var waitOnUpload = fileRef.put(listing.image, metadata)

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
                        }).then((newDocRef: any) => {
                            dispatch({ type: 'UPDATE_LISTING_SUCCESS', newDocRef });
                        }).catch((err: any) => {
                            dispatch({ type: 'UPDATE_LISTING_ERR', err });
                        });
                    })
                })

        } else {
            fileRef = firebaseStorageRef.child('marketplace/P.JPG');
            fileRef.getDownloadURL().then((downloadURL) => {
                docref.update({
                    image: downloadURL
                }).then((newDocRef: any) => {
                    dispatch({ type: 'UPDATE_LISTING_SUCCESS', newDocRef });
                }).catch((err: any) => {
                    dispatch({ type: 'UPDATE_LISTING_ERR', err });
                });
            })
        }
    }
}


//placeholder code
export const deleteSellListing = (listing: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('sellListings').doc(listing.id);

        docref.delete().then(() => {
            dispatch({ type: 'DELETE_LISTING_SUCCESS', docref });
        }).catch((err: any) => {
            dispatch({ type: 'DELETE_LISTING_ERR', err });
        });
    }
}