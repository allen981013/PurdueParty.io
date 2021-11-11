import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { Dispatch, Action } from 'redux';

export const deleteMarketMessages = (messageObjs: any, userID: string) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();

        var messageDeleteErr = false;
        var docref = db.collection('users').doc(userID);
        var errorMsg: any;
        var docrefMsg: any;

        for (let i = 0; i < messageObjs.length; i++) {
            docref.update({
                marketMessages: firebase.firestore.FieldValue.arrayRemove(messageObjs[i])
            }).then((newDocRef: any) => {
                docrefMsg = newDocRef
                console.log("message deleted")
            }).catch((err: any) => {
                messageDeleteErr = true
                errorMsg = err
                console.log("err deleting messgae")
            });
        }

        if (!messageDeleteErr) {
            window.alert("Messages deleted successfully!")
            dispatch({ type: 'DELETE_MESSAGE_SUCCESS', docrefMsg });
        } else {
            dispatch({ type: 'DELETE_MESSAGE_ERR', errorMsg });
        }

    }
}

export const replyListingMessage = (messageObj: any, userID: string, newMessage: string) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const firebase = getFirebase();
        const db = getFirestore();
        var docref = db.collection('users').doc(messageObj.senderID);
        var docref2 = db.collection('users').doc(userID);

        var newMarketMessagesArr: { senderID: string, listingID: string, message: string, messageDate: Timestamp, closed: boolean }[];
        newMarketMessagesArr = []
        var newDate = Timestamp.now()

        docref.get().then((doc: any) => {
            var marketMessages
            if (marketMessages = doc.data().marketMessages) {
                newMarketMessagesArr = marketMessages
                
                newMarketMessagesArr[newMarketMessagesArr.length] = {
                    senderID: userID,
                    listingID: messageObj.listingID,
                    message: newMessage,
                    messageDate: newDate,
                    closed: true
                }
            } else {
                newMarketMessagesArr[0] = {
                    senderID: userID,
                    listingID: messageObj.listingID,
                    message: newMessage,
                    messageDate: newDate,
                    closed: true
                }
            }

            docref2.update({
                marketMessages: firebase.firestore.FieldValue.arrayRemove(messageObj)
            }).then((newDocRef: any) => {
                console.log("message deleted")
            }).catch((err: any) => {
                console.log("err deleting messgae")
            });

            docref.set({
                marketMessages: newMarketMessagesArr
            }, { merge: true }).then((newDocRef: any) => {
                window.alert("Listing reply sent successfully! This message will now be deleted.")
                dispatch({ type: 'LISTING_REPLY_SUCCESS', newDocRef });
            }).catch((err: any) => {
                dispatch({ type: 'LISTING_REPLY_ERR', err });
            });
        }).catch((err: any) => {
            dispatch({ type: 'LISTING_REPLY_ERR', err });
        });
    }
}

export const editUser = (newProfile: any) => {
    return (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore();
        const auth = getAuth();
        var editFlag = true;
        var docref = db.collection('users').doc(auth.currentUser?.uid);

        var checkUsername = db.collection('users').where("userName", "==", newProfile.userName).get().then((querySnapshot: any) => {
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
                querySnapshot.forEach((doc: any) => {
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