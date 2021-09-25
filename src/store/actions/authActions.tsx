import { Dispatch, Action } from 'redux';
import {AppDispatch} from '../index'

export const signIn = (credentials:any) => {
    return (dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const firebase = getFirebase();
        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({ type: 'LOGIN_SUCCESS' });
        }).catch((err:any) => {
            dispatch({ type: 'LOGIN_ERROR', err });
        });
    }
}


//May need adjustments
export const signOut = () => {
    return (dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any )=> {
        const firebase = getFirebase();
        firebase.auth().signOut().then(() => {
            dispatch({ type: 'SIGNOUT_SUCCESS' });
        }).catch((err:any) => {
            dispatch({ type: 'SIGNOUT_ERROR', err });
        });
    }
}

export const deleteAccount = () => {
    return (dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any )=> {
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        // const credential = firebase.auth.EmailAuthProvider.credential(
        //     credentials.email,
        //     credentials.password
        // );

        // user.reauthenticateWithCredential(credential).then(() => {
        //     console.log('test1')
        //   }).catch((err:any) => {
        //     console.log('test2')
        //   });
        user.delete().then(() => {
            dispatch({ type: 'DELETE_SUCCESS' });
        }).catch((err:any) => {
            dispatch({ type: 'DELETE_ERROR', err });
        });
    }
  }

//May need adjustments
export const signUp = (newUser:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const firebase = getFirebase();
        const db = getFirestore();
        
        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((newUserRef:any) => {
            firebase.auth().currentUser.sendEmailVerification();
            return db.collection('users').doc(newUserRef.user.uid).set({
                userName: newUser.email,
                bio: newUser.bio
            })
        }).then(() => {
            dispatch({ type: 'SIGNUP_SUCCESS' })
        }).catch((err:any) => {
            dispatch({ type: 'SIGNUP_ERROR', err })
        })
    }
}