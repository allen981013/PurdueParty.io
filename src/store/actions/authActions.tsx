import { Dispatch, Action } from 'redux';


export const signIn = (credentials: { email: string, password: string }) => {
  return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
    const firebase = getFirebase();
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then((response: any) => {
      const userId = response.user.uid
      // Query username from db
      const db = getFirestore()
      db.collection("users").doc(userId).get()
        .then((doc: any) => {
          let payload = { username: doc.data().username }
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
        userName: newUser.username,
        bio: newUser.bio
      })
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch((err: any) => {
      dispatch({ type: 'SIGNUP_ERROR', err })
    })
  }
}