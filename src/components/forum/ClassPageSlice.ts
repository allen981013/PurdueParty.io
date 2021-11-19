import { createSlice } from '@reduxjs/toolkit'
import { Action, Dispatch } from 'redux'
import { RootState } from '../../store'
import { Post } from './ClassPage'
import moment from 'moment'

export interface FetchCriteria {
  sortBy: "RECENCY" | "POPULARITY";
}

// type for states returned by reducer
export interface ClassPageReduxState {
  posts?: Post[];
}

// initial states
const initState: ClassPageReduxState = {
  posts: undefined,
}

// create slice
export const classPageSlice = createSlice({
  name: 'classPage',
  initialState: initState,
  reducers: {
    fetchClassPostsBegin: (state: ClassPageReduxState): ClassPageReduxState => {
      return {
        ...state,
        posts: undefined,
      }
    },
    fetchClassPostsSuccess: (state: ClassPageReduxState, action): ClassPageReduxState => {
      return {
        ...state,
        posts: action.payload,
      }
    },
  },
})

// actions 

export const fetchClassPosts = (classID: string, fetchCriteria: FetchCriteria) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // Build queries
    const db = getFirestore();
    var postsQueryPromise = db.collection("posts")
      .where("classID", "==", classID)
      .where("ancestorsIDs", "==", [])
    postsQueryPromise = fetchCriteria.sortBy == "POPULARITY"
      ? postsQueryPromise.orderBy("numComments", "desc").orderBy("postedDateTime", "desc")
      : postsQueryPromise.orderBy("postedDateTime", "desc")
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
    dispatch(classPageSlice.actions.fetchClassPostsSuccess(posts))
  }
}