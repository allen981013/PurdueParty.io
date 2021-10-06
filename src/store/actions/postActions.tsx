import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';

// Need to explicitly define these types at some point
export const addPost = (newPost:any) => {
    return(dispatch : Dispatch<Action>, getState:any, { getFirebase, getFirestore}: any ) => {
        const db = getFirestore();
        var docref = db.collection('posts');

        docref.add({
            postId: newPost.postId,
            owner: getState().firebase.auth.uid,
            classID: newPost.classID,
            title: newPost.title,
            description: newPost.description,
            postedDateTime: new Timestamp(0,0),
            upvotes: 1,
            downvotes: 0,
            comments: [],
        }).then((newDocRef:any) => {
            newDocRef.update({
                id: newDocRef.id
            })
            dispatch({ type: 'ADD_POST_SUCCESS', newDocRef });
        }).catch((err:any) => {
            dispatch({ type: 'ADD_POST_ERR', err});
        });
    }
}