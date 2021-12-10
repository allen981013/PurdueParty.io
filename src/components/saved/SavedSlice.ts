import { PostAdd } from '@mui/icons-material'
import { createSlice } from '@reduxjs/toolkit'
import { getDocs, Timestamp } from 'firebase/firestore'
import moment from 'moment'
import { useState } from 'react'
import { Action, Dispatch } from 'redux'
import { RootState } from '../../store'
import { EventsLandingStatesRedux } from '../events/EventsLandingSlice'
import { Post } from '../forum/ClassPage'
import { Class } from '../forum/ForumMainPage'

export interface FetchCriteria {
  sortBy: "RECENCY" | "POPULARITY" | "HOT";
}

interface Events {
  title: string,
  startTime: string,
  location: string,
  imageUrl: string,
  href: string,
  hostName: string
}

interface listing {
  contactInfo: string,
  description: string,
  id: string,
  image: string,
  owner: string,
  postedDateTime: Timestamp,
  price: number,
  title: string,
  type: string,
}

// type for states returned by reducer
export interface SavedPageReduxState {
  SavedPosts: Post[];
  SavedEvents: Events[];
  SavedListings: listing[];
}

// initial states
const initState: SavedPageReduxState = {
  SavedPosts: null,
  SavedEvents: null,
  SavedListings: null,
}

// create slice
export const SavedPageSlice = createSlice({
  name: 'SavedPage',
  initialState: initState,
  reducers: {
    fetchSavedPostsBegin: (state: SavedPageReduxState): SavedPageReduxState => {
      console.log("going here")
      return {
        ...state,
        SavedPosts: null,
      }
    },
    fetchSavedPostsSuccess: (state: SavedPageReduxState, action): SavedPageReduxState => {
      console.log(action)
      return {
        ...state,
        SavedPosts: action.payload,
      }
    },
    fetchSavedEventsBegin: (state: SavedPageReduxState): SavedPageReduxState => {
      console.log("going here")
      return {
        ...state,
        SavedEvents: null,
      }
    },
    fetchSavedEventsSuccess: (state: SavedPageReduxState, action): SavedPageReduxState => {
      console.log(action)
      return {
        ...state,
        SavedEvents: action.payload,
      }
    },
    fetchSavedListingsBegin: (state: SavedPageReduxState): SavedPageReduxState => {
      console.log("going here")
      return {
        ...state,
        SavedListings: null,
      }
    },
    fetchSavedListingsSuccess: (state: SavedPageReduxState, action): SavedPageReduxState => {
      console.log(action)
      return {
        ...state,
        SavedListings: action.payload,
      }
    },
  },
})

// actions

export const fetchSavedPosts = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    const db = getFirestore();
    const state = getState()
    const user = state.firebase.auth.uid;
    var posts = new Array<Post>();
    //console.log(listings)
    //var ids = new Array<String>();
    var payload: any = { savedListings: null };
    console.log(user);
    console.log(user === null);
    if(user === null) {
      dispatch(SavedPageSlice.actions.fetchSavedPostsSuccess(posts))
    }
    var userRef = db.collection("users").doc(user)
    var doc = await userRef.get()
    //console.log(doc);
    let list = doc.data()
    payload = {
      savedPosts: list.savedPosts
    }
    if(payload.savedPosts.length > 0 ){
      for(var i = 0; i < payload.savedPosts.length;i++) {
      var userRef = await db.collection("posts").doc(payload.savedPosts[i]).get()
      console.log(userRef)
        doc = userRef
        console.log(doc)
        console.log(doc.data())
        let post = doc.data()
        var poster = await db.collection("users").doc(post.owner).get()
        var posterID = poster.data().userName;
        let l: Post = {
          title: post.title,
          content: post.content,
          poster: posterID, // store poster's UID first
          numComments: post.numComments,
          numUpvotes: post.voteCount,
          href: "/forum/" + post.classID + "/" + post.postId,
          timeSincePosted: moment(post.postedDateTime.toDate()).fromNow(),
          classID: post.classID,
        }
        posts = Object.assign([], posts);
        if (l != null) {
          posts.push(l)
        }
        console.log(posts)
      //})
      }
    }
    dispatch(SavedPageSlice.actions.fetchSavedPostsSuccess(posts))
  }
}

export const fetchSavedEvents = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    const db = getFirestore();
    const state = getState()
    const user = state.firebase.auth.uid;
    var listings = new Array<Events>();
    if(user === null) {
      dispatch(SavedPageSlice.actions.fetchSavedEventsSuccess(listings))
    }
    //console.log(listings)
    //var ids = new Array<String>();
    var payload: any = { savedListings: null };
    console.log(user);
    var userRef = db.collection("users").doc(user)
    var doc = await userRef.get()
    //console.log(doc);
    let list = doc.data()
    payload = {
      savedEvents: list.savedEvents
    }
    if(payload.savedEvents.length > 0 ){
      for(var i = 0; i < payload.savedEvents.length;i++) {
      var userRef = await db.collection("events").doc(payload.savedEvents[i]).get()
      console.log(userRef)
        doc = userRef
        console.log(doc)
        console.log(doc.data())
        let eve = doc.data()
        let l: Events = {
          title: eve.title,
          startTime: eve.startTime.toDate().toLocaleString("en-US"),
          location: eve.location,
          imageUrl: eve.image,
          href: eve.href,
          hostName: eve.hostName
        }
        if(l.href == null){
          l.href = "/events/" + payload.savedEvents[i]
        }
        listings = Object.assign([], listings);
        if (l != null) {
          listings.push(l)
        }
        console.log(listings)
      //})
      }
    }
    dispatch(SavedPageSlice.actions.fetchSavedEventsSuccess(listings))
  }
}

export const fetchSavedListings = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    const db = getFirestore();
    const state = getState()
    const user = state.firebase.auth.uid;
    var listings = new Array<listing>();
    if(user === null) {
      dispatch(SavedPageSlice.actions.fetchSavedListingsSuccess(listings))
    }
    //console.log(listings)
    //var ids = new Array<String>();
    var payload: any = { savedListings: null };
    console.log(user);
    var userRef = db.collection("users").doc(user)
    var doc = await userRef.get()
    //console.log(doc);
    let list = doc.data()
    if(!list.savedListings) {
      dispatch(SavedPageSlice.actions.fetchSavedListingsSuccess(listings))
    }
    payload = {
      savedListings: list.savedListings
    }
    if(payload.savedListings.length > 0 ){
      for(var i = 0; i < payload.savedListings.length;i++) {
      var userRef = await db.collection("sellListings").doc(payload.savedListings[i]).get()
      console.log(userRef)
        doc = userRef
        console.log(doc)
        console.log(doc.data())
        let list = doc.data()
        let l: listing = {
          title: list.title,
          description: list.description,
          postedDateTime: list.postedDateTime,
          type: list.type,
          price: list.price,
          contactInfo: list.contactInfo,
          id: list.id,
          image: list.image,
          owner: list.owner
        }
        listings = Object.assign([], listings);
        if (l != null) {
          listings.push(l)
        }
        console.log(listings)
      //})
      }
    }
    dispatch(SavedPageSlice.actions.fetchSavedListingsSuccess(listings))
  }
}

/*export const fetchJoinedClasses = () => {
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


export const fetchAllClassesPosts = (fetchCriteria: FetchCriteria) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // Build queries
    let map: string[];
    var index = 0;
    map = (map != null) ? map : []
    const db = getFirestore();
    var posts = new Array<Post>();
    //const [posts, setPosts] = useState(new Array<Post>());
    var postsQueryPromise = fetchCriteria.sortBy == "POPULARITY"
      ? db.collection("posts")
      .where("ancestorsIDs", "==", [])
      .orderBy("numComments", "desc")
      .orderBy("postedDateTime", "desc")
      :fetchCriteria.sortBy == "HOT" 
      ? db.collection("posts")
      .where("ancestorsIDs", "==", [])
      .orderBy("voteCount", "desc")
      .orderBy("postedDateTime", "desc")
      : db.collection("posts")
      .where("ancestorsIDs", "==", [])
      .orderBy("postedDateTime", "desc")
    await postsQueryPromise.get().then((postsDocSnapshots: any[]) => {
    // Transform posts into the correct schema
    console.log(postsDocSnapshots);
    postsDocSnapshots.forEach((docSnapshot) => {
      let post = docSnapshot.data()
      const p: Post = {
        title: post.title,
        content: post.content,
        poster: post.owner, // store poster's UID first
        numComments: post.numComments,
        href: "/forum/" + post.classID + "/" + post.postId,
        timeSincePosted: moment(post.postedDateTime.toDate()).fromNow(),
        classID: post.classID,
      }
      if(p != null) {
        posts.push(p)
        //setPosts(posts => [...posts, p])
      }
      })
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


export const fetchJoinedClassesPosts = (fetchCriteria: FetchCriteria) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // TODO: Get class IDs
    let classIDs: string[] = getState().auth.lastCheckedJoinedClassIDs
    console.log("posts = ", classIDs)
    classIDs = (classIDs != null) ? classIDs : []
    // Build queries
    const db = getFirestore();
    var postsQueryPromises = fetchCriteria.sortBy == "POPULARITY"
    ? classIDs.map(id_ => db.collection("posts")
      .where("classID", "==", id_)
      .where("ancestorsIDs", "==", [])
      .orderBy("numComments", "desc")
      .orderBy("postedDateTime", "desc")
      .get())
    : fetchCriteria.sortBy == "HOT"
    ? classIDs.map(id_ => db.collection("posts")
      .where("classID", "==", id_)
      .where("ancestorsIDs", "==", [])
      .orderBy("voteCount", "desc")
      .orderBy("postedDateTime", "desc")
      .get())
    : classIDs.map(id_ => db.collection("posts")
      .where("classID", "==", id_)
      .where("ancestorsIDs", "==", [])
      .orderBy("postedDateTime", "desc")
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


export const fetchCurUserPosts = (fetchCriteria: FetchCriteria) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState, { getFirebase, getFirestore }: any) => {
    // Build queries
    const state = getState()
    const db = getFirestore();
    //console.log(state.firebase.auth.uid);
    const user = state.firebase.auth.uid;
    var posts = new Array<Post>();
    var postsQueryPromise = db.collection("posts")
      .where("owner", "==", user)
      .where("ancestorsIDs", "==", [])
    postsQueryPromise = fetchCriteria.sortBy == "POPULARITY"
      ? postsQueryPromise.orderBy("numComments", "desc").orderBy("postedDateTime", "desc")
      :postsQueryPromise = fetchCriteria.sortBy == "HOT" 
      ? postsQueryPromise.orderBy("voteCount", "desc").orderBy("postedDateTime", "desc")
      : postsQueryPromise.orderBy("postedDateTime", "desc")
      await postsQueryPromise.get().then((postsDocSnapshots: any[]) => {
        // Transform posts into the correct schema
        console.log(postsDocSnapshots);
        postsDocSnapshots.forEach((docSnapshot) => {
          let post = docSnapshot.data()
          const p: Post = {
            title: post.title,
            content: post.content,
            poster: post.owner, // store poster's UID first
            numComments: post.numComments,
            href: "/forum/" + post.classID + "/" + post.postId,
            timeSincePosted: moment(post.postedDateTime.toDate()).fromNow(),
            classID: post.classID,
          }
          if(p != null) {
            posts.push(p)
            //setPosts(posts => [...posts, p])
          }
          })
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
}*/