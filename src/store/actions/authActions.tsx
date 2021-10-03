import { Dispatch, Action } from 'redux';
import { RootState } from '..';
import { firebaseStorageRef } from '../..';


export const refreshUserData = () => {
    return (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
        const userId = getState().firebase.auth.uid
        var payload = { lastCheckedUsername: "guest", lastCheckedIsLoggedIn: false }
        if (!userId) {
            dispatch({ type: 'USER_DATA_REFRESHED', payload: payload })
            return
        }
        // Query username from db
        const db = getFirestore()
        db.collection("users").doc(userId).get()
            .then((doc: any) => {
                payload = { lastCheckedUsername: doc.data().userName, lastCheckedIsLoggedIn: true }
                dispatch({ type: 'USER_DATA_REFRESHED', payload: payload })
            });

    }
}

export const signIn = (credentials: { email: string, password: string }) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then((response: any) => {
            const userId = response.user.uid
            let payload = { lastCheckedUsername: "guest" }
            if (userId)
                dispatch({ type: 'LOGIN_SUCCESS', payload: payload })  // update login status first while waiting for username query to return
            // Query username from db
            const db = getFirestore()
            db.collection("users").doc(userId).get()
                .then((doc: any) => {
                    let payload = { lastCheckedUsername: doc.data().userName }
                    dispatch({ type: 'LOGIN_SUCCESS', payload: payload })
                });
        }).catch((err: any) => {
            dispatch({ type: 'LOGIN_ERROR', err });
        });
    }
}

//May need adjustments
export const signOut = () => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        firebase.auth().signOut().then(() => {
            dispatch({ type: 'SIGNOUT_SUCCESS' });
        }).catch((err: any) => {
            dispatch({ type: 'SIGNOUT_ERROR', err });
        });
    }
}

const deleteFields = ({ getFirebase, getFirestore }: any, collectionName: any, fieldName: any, docType: any, useruid: any,) => {
    const firebase = getFirebase();
    const db = getFirestore();

    var collection = db.collection(collectionName)
    collection.where(fieldName, docType, useruid).get().then((querySnapshot: any[]) => {
        querySnapshot.forEach((doc) => {
            if (fieldName == 'owner') {
                collection.doc(doc.id).update({
                    owner: firebase.firestore.FieldValue.delete()
                })
            }
            if (fieldName == 'editors') {
                collection.doc(doc.id).update({
                    editors: firebase.firestore.FieldValue.arrayRemove(useruid)
                })
            }
        });
    })
        .catch((error: any) => {
            console.log("Error deleting docs", error);
        });


}

export const deleteAccount = () => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();
        const user = firebase.auth().currentUser;
        const useruid = user.uid;

        //delete user from auth
        user.delete().then(() => {
            //firestore deletions
            //delete user doc
            var collection = db.collection('users');
            collection.doc(useruid).delete().then(() => {
                console.log("user successfully deleted!");
            }).catch(() => {
                console.error("Error removing user from firestore");
            });

            //delete owner and editor fields from events and clubs
            deleteFields({ getFirebase, getFirestore }, 'events', 'owner', '==', useruid)
            deleteFields({ getFirebase, getFirestore }, 'events', 'editors', 'array-contains', useruid)
            deleteFields({ getFirebase, getFirestore }, 'clubs', 'owner', '==', useruid)
            deleteFields({ getFirebase, getFirestore }, 'clubs', 'editors', 'array-contains', useruid)

            //delete users sell listings and fields
            collection = db.collection('sellListings')
            collection.where("owner", "==", useruid).get().then((querySnapshot: any[]) => {
                querySnapshot.forEach((doc) => {
                    //delete sellListing doc
                    collection.doc(doc.id).delete().then(() => {
                        console.log("listing successfully deleted!");
                    }).catch(() => {
                        console.error("Error removing listing");
                    });
                });
            });

            dispatch({ type: 'DELETE_SUCCESS' });
        }).catch((err: any) => {
            dispatch({ type: 'DELETE_ERROR', err });
        });
    }
}

//May need adjustments
export const signUp = (newUser: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();
        var imageURL = ""

        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password,
        ).then((newUserRef: any) => {
            const user = firebase.auth().currentUser
            user.sendEmailVerification();

            //put profile pic in firebase storage
            if (newUser.profilePic != null as any) {
                var fileType = ''
                var metadata = {
                    contentType: '',
                };
                //configure metadata
                if (newUser.profilePic.type == 'image/jpeg' || newUser.profilePic.type == 'image/jpg') {
                    metadata.contentType = 'image/jpeg'
                    fileType = '.jpeg'
                }
                else {
                    metadata.contentType = 'image/png'
                    fileType = '.png'
                }
                //create proper filename with user uid and path
                var fileRef = firebaseStorageRef.child('profilePics/' + user.uid + fileType);

                //upload to firebase storage
                var waitOnUpload = fileRef.put(newUser.profilePic, metadata)

                //create image URL to store in Firestore
                waitOnUpload.on('state_changed', (snapshot) => {
                },
                    (error) => {
                        console.log('upload error')
                    },
                    () => {
                        fileRef.getDownloadURL().then((downloadURL) => {
                            imageURL = downloadURL                          
                        })
                    })

            }
            
            return db.collection('users').doc(newUserRef.user.uid).set({
                userName: newUser.email,
                bio: newUser.bio,
                profilePicURL: imageURL
            })
        }).then(() => {
            dispatch({ type: 'SIGNUP_SUCCESS' })
        }).catch((err: any) => {
            dispatch({ type: 'SIGNUP_ERROR', err })
        })
    }
}
