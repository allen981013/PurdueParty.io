import { Dispatch, Action } from 'redux';
import { RootState } from '..';


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
                payload = { lastCheckedUsername: doc.data().username, lastCheckedIsLoggedIn: true }
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

const deleteFields = ({ getFirebase, getFirestore }: any, collectionName: any, useruid: any) => {
    const firebase = getFirebase();
    const db = getFirestore();

    var collection = db.collection(collectionName)
    collection.where("owner", "==", useruid).get().then((querySnapshot: any[]) => {
        querySnapshot.forEach((doc) => {
            collection.doc(doc.id).update({
                owner: firebase.firestore.FieldValue.delete()
            })
        });
    })
        .catch((error: any) => {
            console.log("Error deleting owner docs", error);
        });

    collection.where("editors", "array-contains", useruid).get().then((querySnapshot: any[]) => {
        querySnapshot.forEach((doc) => {
            collection.doc(doc.id).update({
                editors: firebase.firestore.FieldValue.arrayRemove(useruid)
            });
        });
    })
        .catch((error: any) => {
            console.log("Error deleting editor docs", error);
        });
}

export const deleteAccount = () => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();
        const user = firebase.auth().currentUser;
        const useruid = user.uid;

        if(db.collection('clubs').where("owner", "==", useruid) 
        || db.collection('events').where("owner", "==", useruid)){
            dispatch({ type: 'DELETE_ERROR'});
        }
        
        //delete user from auth
        user.delete().then(() => {
            //firestore deletions
            //delete username and bio fields from users 
            var collection = db.collection('users');
            collection.doc(useruid).update({
                userName: firebase.firestore.FieldValue.delete(),
                bio: firebase.firestore.FieldValue.delete()
            });

            //delete user doc
            collection.doc(useruid).delete().then(() => {
                console.log("user successfully deleted!");
            }).catch(() => {
                console.error("Error removing user");
            });

            //delete owner and editor fields from events and clubs
            deleteFields({ getFirebase, getFirestore }, 'events', useruid)
            deleteFields({ getFirebase, getFirestore }, 'clubs', useruid)

            //delete users sell listings and fields
            collection = db.collection('sellListings')
            collection.where("owner", "==", useruid).get().then((querySnapshot: any[]) => {
                querySnapshot.forEach((doc) => {
                    //delete sellListing fields
                    collection.doc(doc.id).update({
                        owner: firebase.firestore.FieldValue.delete(),
                        contactInfo: firebase.firestore.FieldValue.delete(),
                        description: firebase.firestore.FieldValue.delete(),
                        id: firebase.firestore.FieldValue.delete(),
                        image: firebase.firestore.FieldValue.delete(),
                        postedDateTime: firebase.firestore.FieldValue.delete(),
                        price: firebase.firestore.FieldValue.delete(),
                        title: firebase.firestore.FieldValue.delete(),
                        type: firebase.firestore.FieldValue.delete(),
                    });

                    //delete sellListing doc
                    collection.doc(doc.id).delete().then(() => {
                        console.log("user successfully deleted!");
                    }).catch(() => {
                        console.error("Error removing user");
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

        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((newUserRef: any) => {
            firebase.auth().currentUser.sendEmailVerification();
            return db.collection('users').doc(newUserRef.user.uid).set({
                userName: newUser.email,
                bio: newUser.bio
            })
        }).then(() => {
            dispatch({ type: 'SIGNUP_SUCCESS' })
        }).catch((err: any) => {
            dispatch({ type: 'SIGNUP_ERROR', err })
        })
    }
}
