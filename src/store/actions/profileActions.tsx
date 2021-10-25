import { getAuth } from 'firebase/auth';
import { Dispatch, Action } from 'redux';


export const editUser = (newProfile: any) =>{
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        const auth = getAuth();
        var editFlag = true;
        var docref = db.collection('users').doc(auth.currentUser?.uid);

        var checkUsername = db.collection('users').where("userName", "==", newProfile.userName).get().then((querySnapshot : any) => {
            if (querySnapshot.size == 0) {
                //we know the username is unique
                docref.update({
                    userName: newProfile.userName,
                    major: newProfile.major,
                    bio: newProfile.bio,
                    year: newProfile.year,
                    hide: newProfile.hide
                }).then(() => {
                    dispatch({ type: 'EDIT_PROFILE_SUCCESS' })
                });
            } else {
                querySnapshot.forEach((doc:any) => {
                    console.log(doc.id);
                    console.log(auth.currentUser?.uid);
                    if (doc.id != auth.currentUser?.uid) {
                        //username belongs to some other user, we must alert
                        dispatch({ type: 'EDIT_PROFILE_ERR' })
                        editFlag = false;
                    }
                })

                if (editFlag) {
                    //username either belongs to user or is unique, update
                    docref.update({
                        userName: newProfile.userName,
                        major: newProfile.major,
                        bio: newProfile.bio,
                        year: newProfile.year,
                        hide: newProfile.hide
                    }).then(() => {
                        dispatch({ type: 'EDIT_PROFILE_SUCCESS' })
                    });
                }
            }
        });
    }
}