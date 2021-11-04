import { Dispatch, Action } from 'redux';
import { Timestamp } from '@firebase/firestore';
import { arrayUnion, increment } from 'firebase/firestore';

// Need to explicitly define these types at some point
export const addPost = (newPost: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('posts');

        docref.add({
            ancestorsIDs: [],
            classID: newPost.classID,
            content: newPost.description,
            downvotes: 0,
            numComments: 0,
            owner: getState().firebase.auth.uid,
            postedDateTime: Timestamp.now(),
            title: newPost.title,
            upvotes: 0,
        }).then((newDocRef: any) => {
            newDocRef.update({
                postId: newDocRef.id,
            })
            dispatch({ type: 'ADD_POST_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'ADD_POST_ERR', err });
        });
    }
}

export const addComment = (newPost: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('posts');

        docref.add({
            ancestorsIDs: [newPost.postId],
            classID: newPost.classID,
            content: newPost.description,
            downvotes: 0,
            numComments: 0,
            owner: getState().firebase.auth.uid,
            postedDateTime: Timestamp.now(),
            title: "",
            upvotes: 0,
        }).then(() => {
            var newDocRef = db.collection('posts').doc(newPost.postId);
            //console.log(newDocRef.data());
            newDocRef.update({
                numComments: increment(1),
                comments: arrayUnion(newPost),
            }).catch((err: any) => {
                dispatch({ type: 'ADD_COMMENT_ERR', err });
            });
            dispatch({ type: 'ADD_COMMENT_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'ADD_COMMENT_ERR', err });
        });
    }
}

export const addCommentOnComment = (newPost: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('posts');

        docref.add({
            ancestorsIDs: [newPost.postId, newPost.commentID],
            classID: newPost.classID,
            content: newPost.description,
            downvotes: 0,
            numComments: 0,
            owner: getState().firebase.auth.uid,
            postedDateTime: Timestamp.now(),
            title: "",
            upvotes: 0,
        }).then(() => {
            var newDocRef = db.collection('posts').doc(newPost.postId);
            //console.log(newDocRef.data());
            newDocRef.update({
                numComments: increment(1),
                comments: arrayUnion(newPost),
            }).then(() => {
                var newComRef = db.collection('posts').doc(newPost.commentID);
                newComRef.update({
                    numComments: increment(1),
                    comments: arrayUnion(newPost),
                }).catch((err: any) => {
                    dispatch({ type: 'ADD_COMMENT_ERR', err });
                });
            }).catch((err: any) => {
                dispatch({ type: 'ADD_COMMENT_ERR', err });
            });
            dispatch({ type: 'ADD_COMMENT_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'ADD_COMMENT_ERR', err });
        });
    }
}

export const editPost = (newPost: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        console.log(newPost);
        console.log(newPost.postId);
        var docref = db.collection('posts').doc(newPost.postId);

        docref.update({
            title: newPost.title,
            content: newPost.description,
            postedDateTime: Timestamp.now(),
        }).then((newDocRef: any) => {
            dispatch({ type: 'UPDATE_POST_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'UPDATE_POST_ERR', err });
        });
    }
}

export const editComment = (commentID: any, description: string) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();

        var docref = db.collection('posts').doc(commentID);

        docref.update({
            content: description,
            postedDateTime: Timestamp.now(),
        }).then((newDocRef: any) => {
            window.alert("Comment edited successfully!")
            dispatch({ type: 'UPDATE_COMMENT_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'UPDATE_COMMENT_ERR', err });
        });
    }
}

export const deletePost = (newPost: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        console.log(newPost);
        console.log(newPost.postID);
        var docref = db.collection('posts').doc(newPost.postID);

        docref.delete().then(() => {
            dispatch({ type: 'DELETE_POST_SUCCESS', docref });
        }).catch((err: any) => {
            dispatch({ type: 'DELETE_POST_ERR', err });
        });
    }
}

export const deleteComment = (commentID: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var collection = db.collection('posts')
        var docref = collection.doc(commentID);

        docref.get().then((docWithIDs: any) => {
            let listAncestorIDs
            console.log(listAncestorIDs = docWithIDs.data())
            if (listAncestorIDs) {
                listAncestorIDs = listAncestorIDs.ancestorsIDs

                console.log(listAncestorIDs)
                var currentDoc: any

                if (listAncestorIDs) {
                    for (let i = 0; i < listAncestorIDs.length; i++) {
                        currentDoc = collection.doc(listAncestorIDs[i]);
                        console.log(listAncestorIDs[i])
                        console.log("THEN")
                        currentDoc.get().then((doc: any) => {
                            console.log(doc.data().content)

                            let numComment = doc.data().numComments
                            numComment = numComment - 1;
                            collection.doc(doc.id).update({
                                numComments: numComment
                            })

                        })
                    }
                }
                else {
                    console.log("ancestorIDs error 1")
                }
            }
            else {
                console.log("ancestorIDs error 2")
            }

            docref.delete().then(() => {
                window.alert("Comment Deleted Successfully!");
                dispatch({ type: 'DELETE_COMMENT_SUCCESS', docref });
            }).catch((err: any) => {
                dispatch({ type: 'DELETE_COMMENT_ERR', err });
            });
        }).catch((err: any) => {
            dispatch({ type: 'DELETE_COMMENT_ERR', err });
        });
    }
}

export const addClass = (newClass: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        var docref = db.collection('classes');

        docref.add({
            courseID: newClass.courseID,
            title: newClass.title,
        }).then((newDocRef: any) => {
            newDocRef.update({
                ID: newDocRef.id
            })
            dispatch({ type: 'ADD_CLASS_SUCCESS', newDocRef });
        }).catch((err: any) => {
            dispatch({ type: 'ADD_CLASS_ERR', err });
        });
    }
}
