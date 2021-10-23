import React from 'react'
import { Avatar, Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { AppDispatch, RootState } from '../../store'
import { connect } from 'react-redux'
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase'
import { Action, compose, Dispatch } from 'redux'
import { Redirect } from 'react-router-dom'
import moment from 'moment';
import { actionTypes } from 'redux-firestore';
import { deepOrange } from '@mui/material/colors';


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
        <Box pt="8px" position="relative">
          <Button
            onClick={e => { e.stopPropagation(); e.preventDefault() }}
            sx={{
              textTransform: "none", color: "#787c7e", fontWeight: "bold",
              fontSize: "12px", padding: "4px"
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
      <Box display="flex" flexDirection="row" pt="16px">
        <Box display="flex" flexDirection="column" p="0px 8px 0px 0px">
          <Avatar
            sx={{ width: "28px", height: "28px", fontSize: "14px", bgcolor: "#cfd8dc" }}
          >
            {reply.poster[0]}
          </Avatar>
          <Box
            height="100%"
            alignSelf="center"
            mt="8px"
            sx={{ borderLeft: "1px solid #cfd8dc" }}
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
        >
          <Box display="flex" flexDirection="row" pb="4px">
            {/* Note: We split the following text into separate tags in case we want to 
              proceed with the idea of making username & time clickable` */}
            <Typography
              variant="subtitle2"
              sx={{ color: "#000000", fontSize: "12px", fontWeight: "bold" }}
            >{reply.poster}&nbsp;
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "#787c7e", fontSize: "12px" }}
            >{reply.timeSincePosted}
            </Typography>
          </Box>
          <Typography
            noWrap
            variant="body2"
            sx={{ paddingBottom: "0px" }}
          >
            {reply.content}
          </Typography>
          <Box pt="8px" position="relative">
            <Button
              onClick={e => { e.stopPropagation(); e.preventDefault() }}
              sx={{
                textTransform: "none", color: "#787c7e", fontWeight: "bold",
                fontSize: "12px", padding: "4px"
              }}
            >
              <ChatBubbleOutlineOutlinedIcon
                sx={{ color: "#787c7e", marginRight: "4px", fontSize: "20px" }}
              />
              Reply
            </Button>
          </Box>
          {
            (reply.replies.length > 0)
            && reply.replies.map((reply_) => this.getReply(reply_))
          }
        </Box>
      </Box>
    )
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />
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
        // width="100%"
        // minWidth="800px"
        maxWidth="1300px"
        alignSelf="center"
        p="2rem"
      >
        {this.getPost(this.props.post)}
        {this.props.post.replies.map((reply) => this.getReply(reply))}
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState, props: ThreadPageProps) => {
  // TODO: Move all these logic into a redux action
  var posts = state.firestore.ordered.threadPagePosts // posts array contains only 1 object
  var replies = state.firestore.ordered.threadPageReplies
  var threadElements: ThreadElement[] = posts && replies ? posts.concat(replies) : undefined
  var post: ThreadElement = undefined
  // Build post object
  if (threadElements && threadElements.length > 0) {
    // Map all thread items to the expected schema
    threadElements = threadElements.map((threadEl: any): ThreadElement => {
      return {
        ID: threadEl.id,
        ancestorsIDs: threadEl.ancestorsIDs,
        title: threadEl.title,
        content: threadEl.content,
        poster: "raziqraif",    // TODO: Our post object only contains poster ID for now, and not 
        // username. While we can do some hacks here to get username from ID, I'm 
        // just gonna wait until we've denormalized our DB.
        posterImgUrl: "",
        replies: [],
        numComments: threadEl.numComments,
        timeSincePosted: moment(threadEl.postedDateTime.toDate()).fromNow(),
        isDeleted: false,
      }
    })
    // Get the set of all ancestor IDs
    var allAncestorsIDs = threadElements.reduce((prevVal, curVal) => {
      curVal.ancestorsIDs.forEach(id => prevVal.add(id))
      return prevVal
    }, new Set<string>())
    // Create dict of all IDs to thread items 
    // - create entries for all ancestors (assume they all have been deleted)
    var idToThreadElementDict: {[key: string]: ThreadElement} = {}
    allAncestorsIDs.forEach(id => {idToThreadElementDict[id] = {
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
    }})
    // - create/replace entries for fetched thread items
    idToThreadElementDict = Object.assign(idToThreadElementDict,
      ...threadElements.map(threadEl => (
        { [threadEl.ID]: threadEl }
      ))
    )
    // Transform thread structure from flat to the correct hierarchical structure
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
  // Return processed data
  return {
    auth: state.firebase.auth,
    post: post,
    isDataFetched: threadElements != undefined,
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
      }
    ]
  })
)(ThreadPage)