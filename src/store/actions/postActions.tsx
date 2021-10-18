import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';

// Need to explicitly define these types at some point
export const addPost = (newPost:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('posts');

        docref.add({
            owner: getState().firebase.auth.uid,
            classID: newPost.classID,
            title: newPost.title,
            content: newPost.description,
            postedDateTime: Timestamp.now(),
            upvotes: 0,
            downvotes: 0,
            numComments: 0,
            comments: [],
        }).then((newDocRef:any) => {
            newDocRef.update({
                postId: newDocRef.id

            })
            dispatch({ type: 'ADD_POST_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_POST_ERR', err});
        });
    }
}

export const addClass = (newClass:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('classes');

        docref.add({
            courseID: newClass.courseID,
            title: newClass.title,
        }).then((newDocRef:any) => {
            newDocRef.update({
                ID: newDocRef.id
            })
            dispatch({ type: 'ADD_CLASS_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_CLASS_ERR', err});
        });
    }
}
