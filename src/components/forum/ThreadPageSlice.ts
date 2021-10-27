import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { RootState } from '../../store'
import { ThreadNode } from './ThreadPage'
import moment from 'moment'

// type for states returned by reducer
export interface ThreadPageReduxState {
  post: ThreadNode;
  isPostFetched: boolean;
}

// initial states
const initState: ThreadPageReduxState = {
  post: undefined,
  isPostFetched: false,
}

// create slice
export const threadPageSlice = createSlice({
  name: 'threadPage',
  initialState: initState,
  reducers: {
    fetchPostBegin: (state: ThreadPageReduxState): ThreadPageReduxState => {
      return {
        ...state,
        post: undefined,
        isPostFetched: false,
      }
    },
    fetchPostSuccess: (state: ThreadPageReduxState, action): ThreadPageReduxState => {
      console.log({ action })
      return {
        ...state,
        post: action.payload,
        isPostFetched: true,
      }
    },
  },
})

// actions 

export const fetchPost = (classID: string, postID: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // TODO: Abstract some operations here into smaller helper functions
    const db = getFirestore()
    // Query post and its replies 
    var postQuerySnapshot = await db.collection("posts")
      .where('classID', "==", classID)
      .where('postId', "==", postID)
      .limit(1)
      .get()
    var repliesQuerySnapshot = await db.collection("posts")
      .where('ancestorsIDs', "array-contains", postID)
      .where('classID', "==", classID)
      .orderBy("postedDateTime", "desc")
      .get()
    if (postQuerySnapshot.empty) {
      dispatch(threadPageSlice.actions.fetchPostSuccess(undefined))
      return
    }
    // Build thread nodes array 
    var threadNodes: ThreadNode[] = [...repliesQuerySnapshot.docs, ...postQuerySnapshot.docs]
    // Transform individual thread node into the expected schema
    threadNodes = threadNodes.map((docSnapshot: any): ThreadNode => {
      let node = docSnapshot.data()
      return {
        ID: docSnapshot.id,
        ancestorsIDs: node.ancestorsIDs,
        title: node.title,
        content: node.content,
        poster: node.owner, // Store uid in the poster field first
        posterImgUrl: "",
        replies: [],
        numComments: node.numComments,
        timeSincePosted: moment(node.postedDateTime.toDate()).fromNow(),
        isDeleted: false,
      }
    })
    // Build set of user IDs
    var uids: Set<string> = threadNodes.reduce((prevSet, curNode) => {
      prevSet.add(curNode.poster)
      return prevSet
    }, new Set<string>())
    // Build array of promises for user objects
    var getUsersPromises: Promise<any>[] = []
    uids.forEach(uid => {
      getUsersPromises.push(db.collection("users").doc(uid).get())
    })
    // Build array of user doc snapshots 
    var userDocSnapshots = await Promise.all(getUsersPromises)
    // Build a dict of uid-to-user object
    var idToUserDict = userDocSnapshots.reduce((prevVal: any, curVal: any) => {
      prevVal[curVal.id] = curVal.data()
      return prevVal
    }, {})
    // Populate user data into thread node objects
    threadNodes = threadNodes.map(threadNode => {
      let uid = threadNode.poster
      let user = uid in idToUserDict ? idToUserDict[uid] : {}
      // Note: poster & posterImgUrl will be undefined if the user does not exist
      return {
        ...threadNode,
        poster: user.userName,
        posterImgUrl: user.imageUrl,    // TODO: Update this once we have supported profile picture
      }
    })
    console.log({ threadNodes })
    /* Build post object */
    // Get the set of all ancestor IDs
    var allAncestorsIDs = threadNodes.reduce((prevVal, curVal) => {
      curVal.ancestorsIDs.forEach(id => prevVal.add(id))
      return prevVal
    }, new Set<string>())
    // Create dict of ID-to-thread node object 
    // - create entries for all ancestors (assume they all have been deleted)
    var idToThreadElementDict: { [key: string]: ThreadNode } = {}
    allAncestorsIDs.forEach(id => {
      idToThreadElementDict[id] = {
        ID: id,
        ancestorsIDs: [],
        title: "",
        content: "",
        poster: "",
        posterImgUrl: "",
        replies: [],
        numComments: 0,
        timeSincePosted: "",
        isDeleted: true,
      }
    })
    // - create/replace entries for fetched thread nodes 
    idToThreadElementDict = Object.assign(idToThreadElementDict,
      ...threadNodes.map(threadEl => (
        { [threadEl.ID]: threadEl }
      ))
    )
    // Transform thread into the correct hierarchical structure
    threadNodes.forEach(threadEl => {
      let ancestorIdx = threadEl.ancestorsIDs.length - 1
      if (ancestorIdx == -1) return
      let ancestor: ThreadNode = idToThreadElementDict[threadEl.ancestorsIDs[ancestorIdx]]
      ancestor.replies.push(threadEl)
      // Cater to the situation where the current ancestor was deleted
      while (ancestor.isDeleted) {
        // NOTE: It is assumed that the top-most ancestor (the main post) is not deleted
        let olderAncestor = idToThreadElementDict[threadEl.ancestorsIDs[--ancestorIdx]]
        olderAncestor.replies.push(ancestor)
        ancestor = olderAncestor
      }
    })
    var post: ThreadNode = idToThreadElementDict[postID]
    console.log({ idToThreadElementDict })
    console.log({ post })
    dispatch(threadPageSlice.actions.fetchPostSuccess(post))
  }
}

