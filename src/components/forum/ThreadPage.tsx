import React from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { AppDispatch, RootState } from '../../store'
import { connect } from 'react-redux'
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase'
import { Action, compose, Dispatch } from 'redux'
import { Redirect } from 'react-router-dom'
import moment from 'moment';
import { actionTypes } from 'redux-firestore';


interface Post {
  // Metadata to track relation between post/replies/nested replies
  ID: string;
  parentID: string;
  rootID: string;
  replies: Post[];
  // Data to be displayed
  title: string;
  content: string;
  poster: string;
  numComments: number;
  timeSincePosted: string;
}

interface ThreadPageProps {
  auth?: FirebaseReducer.AuthState;
  classID: string;
  postID: string;
  post?: Post;
  isDataFetched?: boolean;
  clearFirestoreState?: () => void;
}

interface ThreadPageStates {

}

class ThreadPage extends React.Component<ThreadPageProps, ThreadPageStates> {

  componentDidMount() {
    // TODO: Is there a better way to reset isDataFetched without clearing firestore state?
    const postIsEmptyOrExpired = () => !this.props.post
      || (this.props.post
        && this.props.post.ID !== this.props.postID)
    if (postIsEmptyOrExpired()) {
      this.props.clearFirestoreState()
    }
  }

  getPost(post: Post) {
    return (
      <Grid
        item
        xs={12}
        md={12}
      >
        <Card sx={{ marginBottom: "16px" }}>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
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
                disabled
                onClick={e => { e.stopPropagation(); e.preventDefault() }}
                sx={{ textTransform: "none", color: "#787c7e", fontWeight: "bold", fontSize: "12px" }}
              >
                <ChatBubbleOutlineOutlinedIcon
                  sx={{ color: "#787c7e", marginRight: "4px", fontSize: "20px" }}
                />
                {post.numComments} Comments
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid >
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
        width="100%"
        maxWidth="1200px"
        alignSelf="center"
        p="2rem"
      >
        {this.getPost(this.props.post)}
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const posts = state.firestore.ordered.posts;
  return {
    auth: state.firebase.auth,
    post: (posts && posts.length > 0)
      ? posts.map((post: any) => {
        return {
          title: post.title,
          content: post.content,
          poster: "raziqraif",    // TODO: Our post object only contains poster ID for now, and not 
          // username. While we can do some hacks here to get username from ID, I'm 
          // just gonna wait until we've denormalized our DB.
          numComments: post.numComments,
          href: "/classes/" + post.classID + "/" + post.postId,
          timeSincePosted: moment(post.postedDateTime.toDate()).fromNow()
        }
      })[0]
      : undefined,
    isDataFetched: posts != undefined,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    // TODO: Is there a better way to reset isDataFetched without clearing firestore query?
    clearFirestoreState: () => dispatch(
      (reduxDispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        reduxDispatch({ type: actionTypes.CLEAR_DATA })
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
        doc: props.postID,
      }
    ]
  })
)(ThreadPage)