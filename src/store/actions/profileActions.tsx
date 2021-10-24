import { getAuth } from 'firebase/auth';
import { Dispatch, Action } from 'redux';


export const editUser = (newProfile: any) =>{
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        const auth = getAuth();
        var docref = db.collection('users').doc(auth.currentUser?.uid);

        docref.update({
            userName: newProfile.userName,
            major: newProfile.major,
            bio: newProfile.bio,
            year: newProfile.year,
            hide: newProfile.hide
        });
    }
}