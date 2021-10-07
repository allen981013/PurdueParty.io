import { Dispatch, Action } from 'redux';


export const editUser = (newProfile: any) =>{
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('profile');
        var imageURL = "";

        docref.add({
            id: getState().firebase.auth.uid,
            bio: newProfile.bio,
            userName: newProfile.userName,
            major: newProfile.major,
            year: newProfile.type,
        }).then((newDocRef: any) => {
            newDocRef.update({
                id: newDocRef.id
            })

            dispatch({ type: 'EDITE_PROFILE_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'EDITE_PROFILE_ERR', err });
        });
    }
}