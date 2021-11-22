import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { Action, Dispatch } from 'redux'
import { RootState } from '../../store'
import { Post } from './ClassPage'
import { Class } from './ForumMainPage'

// type for states returned by reducer
export interface ForumMainPageReduxState {
  allClassesPosts: Post[];
  joinedClassesPosts: Post[];
  curUserPosts: Post[];
  joinedClasses: Class[];
}

// initial states
const initState: ForumMainPageReduxState = {
  allClassesPosts: null,
  joinedClassesPosts: null,
  curUserPosts: null,
  joinedClasses: null,
}

// create slice
export const forumMainPageSlice = createSlice({
  name: 'forumMainPage',
  initialState: initState,
  reducers: {
    fetchJoinedClassesSuccess: (state: ForumMainPageReduxState, action): ForumMainPageReduxState => {
      return {
        ...state,
        joinedClasses: action.payload,
      }
    },
    fetchJoinedClassesPostsBegin: (state: ForumMainPageReduxState): ForumMainPageReduxState => {
      return {
        ...state,
        joinedClassesPosts: null,
      }
    },
    fetchJoinedClassesPostsSuccess: (state: ForumMainPageReduxState, action): ForumMainPageReduxState => {
      return {
        ...state,
        joinedClassesPosts: action.payload,
      }
    },
    fetchAllClassesPostsBegin: (state: ForumMainPageReduxState): ForumMainPageReduxState => {
      return {
        ...state,
        allClassesPosts: null,
      }
    },
    fetchAllClassesPostsSuccess: (state: ForumMainPageReduxState, action): ForumMainPageReduxState => {
      return {
        ...state,
        allClassesPosts: action.payload,
      }
    },
    fetchCurUserPostsBegin: (state: ForumMainPageReduxState): ForumMainPageReduxState => {
      return {
        ...state,
        curUserPosts: null,
      }
    },
    fetchCurUserPostsSuccess: (state: ForumMainPageReduxState, action): ForumMainPageReduxState => {
      return {
        ...state,
        curUserPosts: action.payload,
      }
    },
  },
})

// actions

export const fetchJoinedClasses = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // TODO: Get joined classIDs
    let classIDs: string[] = getState().auth.lastCheckedJoinedClassIDs
    classIDs = (classIDs != null) ? classIDs : []
    console.log("classes = ", classIDs)
    // Build queries
    const db = getFirestore();
    var classesQueryPromises = classIDs.map(id_ => db.collection("classes").where("courseID", "==", id_).get())
    var classesDocSnapshots = (await Promise.all(classesQueryPromises))
    classesDocSnapshots = classesDocSnapshots.map(docsSnapshot => docsSnapshot.docs).flat()
    // Transform classes into the correct schema
    var classes: Class[] = classesDocSnapshots.map((docSnapshot: any): Class => {
      let class_ = docSnapshot.data()
      return {
        title: class_.courseID + " -  " + class_.title,
        href: "/forum/" + class_.courseID
      }
    })
    dispatch(forumMainPageSlice.actions.fetchJoinedClassesSuccess(classes))
  }
}


export const fetchAllClassesPosts = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
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
    dispatch(forumMainPageSlice.actions.fetchAllClassesPostsSuccess(posts))
  }
}


export const fetchJoinedClassesPosts = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // TODO: Get class IDs
    let classIDs: string[] = getState().auth.lastCheckedJoinedClassIDs
    console.log("posts = ", classIDs)
    classIDs = (classIDs != null) ? classIDs : []
    // Build queries
    const db = getFirestore();
    var postsQueryPromises = classIDs.map(id_ => db.collection("posts")
      .where("classID", "==", id_)
      .where("ancestorsIDs", "==", [])
      .get())
    var postsQuerySnapshots = (await Promise.all(postsQueryPromises))
    var postsDocSnapshots = postsQuerySnapshots.map(querySnapshot => querySnapshot.docs).flat()
    // Transform posts into the correct schema
    var posts: Post[] = postsDocSnapshots.map((docSnapshot: any): Post => {
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
    dispatch(forumMainPageSlice.actions.fetchJoinedClassesPostsSuccess(posts))
  }
}


export const fetchCurUserPosts = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // Build queries
    const state = getState()
    const db = getFirestore();
    var postsQueryPromise = db.collection("posts")
      .where("ancestorsIDs", "==", [])
      .where("owner", "==", state.firebase.auth.uid)
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
    dispatch(forumMainPageSlice.actions.fetchCurUserPostsSuccess(posts))
  }
}