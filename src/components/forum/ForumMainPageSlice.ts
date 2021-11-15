import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { Action, Dispatch } from 'redux'
import { RootState } from '../../store'
import { Post } from './ClassPage'

// type for states returned by reducer
export interface ForumMainPageReduxState {
  postsFromAllClasses: Post[];
  postsFromFollowedClasses: Post[];
}

// initial states
const initState: ForumMainPageReduxState = {
  postsFromAllClasses: null,
  postsFromFollowedClasses: null 
}

// create slice
export const forumMainPageSlice = createSlice({
  name: 'forumMainPage',
  initialState: initState,
  reducers: {
    fetchPostsFromFollowedClassesBegin: (state: ForumMainPageReduxState): ForumMainPageReduxState => {
      return {
        ...state,
        postsFromFollowedClasses: null,
      }
    },
    fetchPostsFromFollowedClassesSuccess: (state: ForumMainPageReduxState, action): ForumMainPageReduxState => {
      return {
        ...state,
        postsFromFollowedClasses: action.payload,
      }
    },
    fetchPostsFromAllClassesBegin: (state: ForumMainPageReduxState): ForumMainPageReduxState => {
      return {
        ...state,
        postsFromAllClasses: null,
      }
    },
    fetchPostsFromAllClassesSuccess: (state: ForumMainPageReduxState, action): ForumMainPageReduxState => {
      return {
        ...state,
        postsFromAllClasses: action.payload,
      }
    },
  },
})

// actions

export const fetchPostsFromAllClasses = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    console.log("fetching all posts")
    // Build queries
    const db = getFirestore();
    var postsQueryPromise = db.collection("posts")
      .where("ancestorsIDs", "==", [])
    var postsDocSnapshots = await postsQueryPromise.get()
    // Transform posts into the correct schema
    var posts: Post[] = postsDocSnapshots.docs.map((docSnapshot: any): Post => {
      let post = docSnapshot.data()
      return {
        title: post.title,
        content: post.content,
        poster: post.owner, // store poster's UID first
        numComments: post.numComments,
        href: "/forum/" + post.classID + "/" + post.postId,
        timeSincePosted: moment(post.postedDateTime.toDate()).fromNow(),
        classID: post.classID,
      }
    })
    // Build set of user IDs
    var uids: Set<string> = posts.reduce((prevSet, curNode) => {
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
    // Populate user data into post objects
    posts = posts.map(post => {
      let uid = post.poster
      let userName = idToUserDict[uid] ? idToUserDict[uid].userName : undefined
      // Note: poster will be undefined if the user does not exist
      return {
        ...post,
        poster: userName,
      }
    })
    console.log({posts})
    dispatch(forumMainPageSlice.actions.fetchPostsFromAllClassesSuccess(posts))
  }
}


export const fetchPostsFromFollowedClasses = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    console.log("fetching followed posts")
    // Build queries
    const db = getFirestore();
    var postsQueryPromise = db.collection("posts")
      .where("ancestorsIDs", "==", [])
    var postsDocSnapshots = await postsQueryPromise.get()
    // Transform posts into the correct schema
    var posts: Post[] = postsDocSnapshots.docs.map((docSnapshot: any): Post => {
      let post = docSnapshot.data()
      return {
        title: post.title,
        content: post.content,
        poster: post.owner, // store poster's UID first
        numComments: post.numComments,
        href: "/forum/" + post.classID + "/" + post.postId,
        timeSincePosted: moment(post.postedDateTime.toDate()).fromNow(),
        classID: post.classID,
      }
    })
    // Build set of user IDs
    var uids: Set<string> = posts.reduce((prevSet, curNode) => {
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
    // Populate user data into post objects
    posts = posts.map(post => {
      let uid = post.poster
      let userName = idToUserDict[uid] ? idToUserDict[uid].userName : undefined
      // Note: poster will be undefined if the user does not exist
      return {
        ...post,
        poster: userName,
      }
    })
    console.log({posts})
    dispatch(forumMainPageSlice.actions.fetchPostsFromFollowedClassesSuccess(posts))
  }
}