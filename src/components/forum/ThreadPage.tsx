import React from 'react'
import { Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { AppDispatch, RootState } from '../../store'
import { connect } from 'react-redux'
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase'
import { Action, compose, Dispatch } from 'redux'
import { Redirect } from 'react-router-dom'
import moment from 'moment';
import { actionTypes } from 'redux-firestore';
import { PostsLandingProps } from './PostsLanding';
import { firestoreDb } from '../..';


interface ThreadElement { // Thread element refers to a post or a reply
  // Metadata to track relation between post/replies/nested replies
  ID: string;
  ancestorsIDs: [];
  replies: ThreadElement[];
  // Data to be displayed
  title: string;
  content: string;
  poster: string;
  posterImgUrl: string;
  numComments: number;
  timeSincePosted: string;
  isDeleted: boolean;
}

interface ThreadPageProps {
  auth?: FirebaseReducer.AuthState;
  classID: string;
  postID: string;
  post?: ThreadElement;
  classInfo?: PostsLandingProps["classInfo"]
  isDataFetched?: boolean;
  clearFetchedDocs?: () => void;
}

interface ThreadPageStates {
}

class ThreadPage extends React.Component<ThreadPageProps, ThreadPageStates> {

  componentDidMount() {
    const postIsEmptyOrObsolete = () => !this.props.post
      || (this.props.post
        && this.props.post.ID !== this.props.postID)
    if (postIsEmptyOrObsolete()) {
      this.props.clearFetchedDocs()
    }
  }

  getPost = (post: ThreadElement) => {
    return (
      <Box
        sx={{
          display: "flex", flexDirection: "column", alignItems: "flex-start",
          padding: "0px 4px 0px 4px"
        }}
      >
        <Box display="flex" flexDirection="row" pb="4px">
          {/* Note: We split the following text into separate tags in case we want to 
            proceed with the idea of making username & time clickable` */}
          <Typography
            variant="subtitle2"
            sx={{ color: "#000000", fontSize: "12px", fontWeight: "bold" }}
          >{this.props.classID}&nbsp;
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#787c7e", fontSize: "12px" }}
          >. Posted by&nbsp;
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#787c7e", fontSize: "12px" }}
          >{post.poster}&nbsp;
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#787c7e", fontSize: "12px" }}
          >{post.timeSincePosted}
          </Typography>
        </Box>
        <Typography
          noWrap
          variant="h6"
          sx={{ fontSize: "18px", paddingBottom: "4px" }}
        >
          {post.title}
        </Typography>
        <Typography
          noWrap
          variant="body2"
          sx={{ paddingBottom: "0px" }}
        >
          {post.content}
        </Typography>
        <Box pt="8px">
          <Button
            onClick={e => { e.stopPropagation(); e.preventDefault() }}
            sx={{
              textTransform: "none", color: "#787c7e", fontWeight: "bold",
              fontSize: "12px", padding: "4px 4px"
            }}
          >
            <ChatBubbleOutlineOutlinedIcon
              sx={{ color: "#787c7e", marginRight: "4px", fontSize: "20px" }}
            />
            {post.numComments} Comments
          </Button>
        </Box>
      </Box>
    )
  }

  getReply = (reply: ThreadElement) => {
    return (
      <Box display="flex" flexDirection="column" pt="16px">
        {/* Avatar, poster name, & time since posted */}
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            sx={{
              width: "28px", height: "28px", fontSize: "14px", bgcolor: "#cfd8dc",
              margin: "4px 8px"
            }}
          >
            {reply.poster[0]}
          </Avatar>
          <Typography
            variant="subtitle2"
            sx={{ color: "#000000", fontSize: "12px", fontWeight: "bold" }}
          >
            {reply.isDeleted ? "[ deleted ]" : reply.poster} &nbsp;
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#787c7e", fontSize: "12px" }}
          >{reply.timeSincePosted}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row">
          {/* Vertical line */}
          <Divider orientation="vertical" flexItem sx={{ margin: "0px 0px 0px 22px" }} ></Divider>
          <Box display="flex" flexDirection="column">
            {/* Main content */}
            {
              reply.isDeleted
                ? (
                  <Box>
                    <Typography
                      noWrap
                      variant="body2"
                      sx={{ marginLeft: "22px" }}
                    >
                      [ deleted ]
                    </Typography>
                  </Box>
                )
                : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    ml="22px"
                  >
                    <Typography
                      noWrap
                      variant="body2"
                      sx={{ paddingBottom: "0px" }}
                    >
                      {reply.content}
                    </Typography>
                    {/* Interaction widgets */}
                    <Box pt="8px">
                      <Button
                        onClick={e => { e.stopPropagation(); e.preventDefault() }}
                        sx={{
                          textTransform: "none", color: "#787c7e", fontWeight: "bold",
                          fontSize: "12px", padding: "4px 0px"
                        }}
                      >
                        <ChatBubbleOutlineOutlinedIcon
                          sx={{ color: "#787c7e", marginRight: "4px", fontSize: "20px" }}
                        />
                        Reply
                      </Button>
                    </Box>
                  </Box>

                )
            }
            {
              (reply.replies.length > 0)
              && reply.replies.map((reply_) => this.getReply(reply_))
            }
          </Box>
        </Box>
      </Box>
    )
  }

  getClass(class_: PostsLandingProps["classInfo"]) {
    return (
      <Card>
        <Box p="12px 16px" sx={{ background: "#f3f4f6", color: "black" }}>
          Class Info
        </Box>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <label htmlFor="title">Course:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.title}
          </Typography>
          <label htmlFor="title">Department:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.department}
          </Typography>
          <label htmlFor="title">Description:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.description}
          </Typography>
          <label htmlFor="title">Instructor:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.instructorName}
          </Typography>
          <label htmlFor="title">Instructor Email:</label>
          <Typography noWrap variant="body2" component="div">
            {class_.instructorEmail}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  render() {
    if (this.props.auth && !this.props.auth.uid) return <Redirect to='/signin' />
    if (!this.props.isDataFetched)
      return (
        <Box pt="32px"><CircularProgress /></Box>
      )
    if (this.props.isDataFetched && this.props.post === undefined)
      return (
        <Box pt="32px">Post does not exists</Box>
      )
    return (
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        // minWidth="800px"
        maxWidth="1200px"
        alignSelf="center"
        p="2rem"
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Card sx={{ minHeight: "100vh" }}>
              <Box p="12px 16px" sx={{ background: "#f3f4f6", color: "black", textAlign: "left" }}>
                Thread
              </Box>
              <CardContent sx={{ textAlign: "left" }}>
                {this.getPost(this.props.post)}
                {this.props.post.replies.map((reply) => this.getReply(reply))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            {this.getClass(this.props.classInfo)}
          </Grid>
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState, props: ThreadPageProps) => {
  // TODO: Move all these logic into a redux action
  var posts = state.firestore.ordered.threadPagePosts // posts array contains only 1 object
  var replies = state.firestore.ordered.threadPageReplies
  var threadElements: ThreadElement[] = posts && replies ? posts.concat(replies) : undefined
  // Map all thread elements to the expected schema
  threadElements = threadElements
    ? threadElements.map((threadEl: any): ThreadElement => {
      return {
        ID: threadEl.id,
        ancestorsIDs: threadEl.ancestorsIDs,
        title: threadEl.title,
        content: threadEl.content,
        poster: threadEl.owner,
        posterImgUrl: "",
        replies: [],
        numComments: threadEl.numComments,
        timeSincePosted: moment(threadEl.postedDateTime.toDate()).fromNow(),
        isDeleted: false,
      }
    })
    : undefined
  // Populate user data into thread elements 
  var getUsersPromises = threadElements
    ? threadElements.map(threadEl => firestoreDb.collection("users").doc(threadEl.poster).get())
    : []
  Promise.all(getUsersPromises).then(docSnapshots => {
    var idToUserDict = docSnapshots.reduce((prevVal: any, curVal) => {
      prevVal[curVal.id] = curVal.data()
      return prevVal
    }, {})
  });
  // Build post object
  var post: ThreadElement = undefined
  if (threadElements && threadElements.length > 0) {
    // Get the set of all ancestor IDs
    var allAncestorsIDs = threadElements.reduce((prevVal, curVal) => {
      curVal.ancestorsIDs.forEach(id => prevVal.add(id))
      return prevVal
    }, new Set<string>())
    // Create dict of ID-to-thread elements 
    // - create entries for all ancestors (assume they all have been deleted)
    var idToThreadElementDict: { [key: string]: ThreadElement } = {}
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
    // - create/replace entries for fetched thread items
    idToThreadElementDict = Object.assign(idToThreadElementDict,
      ...threadElements.map(threadEl => (
        { [threadEl.ID]: threadEl }
      ))
    )
    // Transform thread into the correct hierarchical structure
    threadElements.forEach(threadEl => {
      let ancestorIdx = threadEl.ancestorsIDs.length - 1
      if (ancestorIdx == -1) return
      let ancestor: ThreadElement = idToThreadElementDict[threadEl.ancestorsIDs[ancestorIdx]]
      ancestor.replies.push(threadEl)
      // Cater to the situation where the current ancestor was deleted
      while (ancestor.isDeleted) {
        // NOTE: It is assumed that the top-most ancestor (the main post) is not deleted
        let olderAncestor = idToThreadElementDict[threadEl.ancestorsIDs[--ancestorIdx]]
        olderAncestor.replies.push(ancestor)
        ancestor = olderAncestor
      }
    })
    post = idToThreadElementDict[props.postID]
  }
  // Map class object to meet the UI's need
  var classes = state.firestore.ordered.classPageClasses
  var classInfo: PostsLandingProps["classInfo"] = (classes !== undefined && classes.length > 0)
    ? classes.map((class_: any) => {
      return {
        title: class_.title,
        description: class_.description,
        department: class_.department,
        instructorName: class_.instructorName,
        instructorEmail: class_.profEmail,
        classID: class_.classID,
      }
    })[0]
    : undefined
  // Return processed data
  return {
    auth: state.firebase.auth,
    post: post,
    classInfo: classInfo,
    isDataFetched: threadElements != undefined && classes != undefined,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch, props: ThreadPageProps) => {
  return {
    clearFetchedDocs: () => dispatch(
      (reduxDispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        reduxDispatch({
          type: actionTypes.LISTENER_RESPONSE,
          meta: {
            collection: 'posts',
            doc: props.postID,
            storeAs: "threadPagePosts"
          },
          payload: {}
        })
      }
    )
  }
}

export default compose<React.ComponentType<ThreadPageProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: ThreadPageProps) => {
    if (props.postID === undefined)
      return []
    return [
      {
        collection: 'posts',
        where: [
          ["ancestorsIDs", "array-contains", props.postID]
        ],
        storeAs: 'threadPageReplies'
      },
      {
        collection: 'posts',
        doc: props.postID,
        storeAs: 'threadPagePosts'
      },
      {
        collection: "classes",
        where: [
          ["courseID", "==", props.classID],
        ],
        storeAs: "classPageClasses",
        limit: 1,
      }

    ]
  })
)(ThreadPage)