import { Firestore, query, queryEqual, where } from 'firebase/firestore';
import { isEmpty } from 'react-redux-firebase';
import { Dispatch, Action } from 'redux';
//import { StringLiteralLike } from 'typescript';
import { RootState } from '..';
import { getAuth, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { current } from '@reduxjs/toolkit';
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
                console.log('owner deleted')
            }
            if (fieldName == 'editors') {
                collection.doc(doc.id).update({
                    editors: firebase.firestore.FieldValue.arrayRemove(useruid)
                })
                console.log('editor deleted')
            }
        });
    })
        .catch((error: any) => {
            console.log("Error deleting docs", error);
        });
}

const deleteFromStorage = (deletePath: any) => {
    firebaseStorageRef.child(deletePath + '.png').getDownloadURL().then(() => {
        firebaseStorageRef.child(deletePath + '.png')
            .delete().then(() => {
                console.log("png profile pic deleted!");
            }).catch(() => {
                console.log("png profile pic delete error!");
            });
    }
        , () => {
            firebaseStorageRef.child(deletePath + '.jpeg')
                .delete().then(() => {
                    console.log("jpeg profile pic deleted!");
                }).catch(() => {
                    console.log("jpeg profile pic delete error!");
                });
            firebaseStorageRef.child(deletePath + '.jpg')
                .delete().then(() => {
                    console.log("jpg profile pic deleted!");
                }).catch(() => {
                    console.log("jpg profile pic delete error!");
                });
        });
}

const deleteDocs = ({ getFirebase, getFirestore }: any, collectionName: any, fieldName: any, docType: any, useruid: any,) => {
    const firebase = getFirebase();
    const db = getFirestore();
    var storageLoc = ''

    if(collectionName === 'events'){
        storageLoc = 'events/'
    }
    else {
        storageLoc = 'marketplace/'
    }

    var collection = db.collection(collectionName)
    collection.where(fieldName, docType, useruid).get().then((querySnapshot: any[]) => {
        querySnapshot.forEach((doc) => {
            //delete sellListing image from storage
            deleteFromStorage(storageLoc + doc.id);
            console.log(doc.id)

            //delete sellListing doc
            collection.doc(doc.id).delete().then(() => {
                console.log("doc successfully deleted!" + collectionName);
            }).catch(() => {
                console.error("Error removing doc" + collectionName);
            });
        });
    });
}

export const deleteAccount = () => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();
        const user = firebase.auth().currentUser;
        const useruid = user.uid;

        // delete profile pic from storage
        deleteFromStorage('profilePics/' + user.uid);

        //delete users sell listings and fields

        console.log(useruid)

        deleteDocs({ getFirebase, getFirestore }, 'sellListings', 'owner', '==', useruid)
        deleteDocs({ getFirebase, getFirestore }, 'events', 'ownerID', '==', useruid)

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
            //deleteFields({ getFirebase, getFirestore }, 'events', 'owner', '==', useruid)
            deleteFields({ getFirebase, getFirestore }, 'events', 'editors', 'array-contains', useruid)
            deleteFields({ getFirebase, getFirestore }, 'clubs', 'owner', '==', useruid)
            deleteFields({ getFirebase, getFirestore }, 'clubs', 'editors', 'array-contains', useruid)
            deleteFields({ getFirebase, getFirestore }, 'posts', 'owner', '==', useruid)

            dispatch({ type: 'DELETE_SUCCESS' });
        }).catch((err: any) => {
            window.alert("Please log out and log back in to delete your account")
            dispatch({ type: 'DELETE_ERROR', err });
        });
    }
}

//May need adjustments
export const signUp = (newUser: any) => {
    return async (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();
        var imageURL = "";

        // Create a reference to the cities collection
        //var citiesRef = db.collection("users");

        // Create a query against the collection.
        var q = db.collection("users").where("userName", "==", newUser.username);
        const snapshot = await db.collection("users").where("userName", "==", newUser.username).get();
        if (!snapshot.empty) {
            dispatch({ type: 'SIGNUP_ERROR', string: "non-original username" })
            return;
        }

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

                //create image URL to store in Firestore (not working yet)
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
                userName: newUser.username,
                bio: newUser.bio,
                email: newUser.email
                // profilePicURL: imageURL
            })
        }).then(() => {
            dispatch({ type: 'SIGNUP_SUCCESS' })
        }).catch((err: any) => {
            dispatch({ type: 'SIGNUP_ERROR', err })
        })
    }
}

/*export const changePassword = (credentials: { newPassword: string }) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();
        const user = {
            newPassword: credentials.newPassword,
        };
  
        let uid;
        db.doc(`/users/${firebase.auth().currentUser}`) //Access database by document
        .get() //Accesses the user requested, returns the user as a doc
        .then((doc) => {
            uid = doc.data().userId;
            firebase.auth().updateUser(uid, {
                password: user.newPassword
            })
            .then(() => {
                dispatch({ type: 'SIGNUP_SUCCESS' })
                firebase.auth().signOut();
            }).catch((err: any) => {
                dispatch({ type: 'SIGNUP_ERROR', err })
            });
        })
    }
  }*/
  
export const changePassword = (newPass: String) => {
  return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
    const firebase = getFirebase();
    const user = firebase.auth().currentUser;
    //const auth = getAuth();
    //const user = auth.currentUser;

    console.log(newPass);
    user.updatePassword(newPass).then(() => {
        console.log(user);
        //dispatch({ type: 'SIGNUP_SUCCESS' })
        firebase.auth().signOut()
    }).catch((err: any) => {
        dispatch({ type: 'SIGNUP_ERROR', err })
        console.log(err)
    });
  }
}

export const resetPasswordRequest = (credentials: { email: string }) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, credentials.email)
            .then(() => {
                dispatch({ type: 'SIGNUP_SUCCESS' })
            }).catch((err: any) => {
                dispatch({ type: 'SIGNUP_ERROR', err })
            });
    }
}

export const resetPassword = (credentials: { email: string, username: string, password: string }) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const auth = getAuth();
        const firebase = getFirebase();
        updatePassword(firebase.auth().currentUser, credentials.password)
            .then(() => {
                dispatch({ type: 'SIGNUP_SUCCESS' })
            }).catch((err: any) => {
                dispatch({ type: 'SIGNUP_ERROR', err })
            });
    }
}