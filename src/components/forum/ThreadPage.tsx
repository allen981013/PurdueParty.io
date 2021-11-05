import './ThreadPage.css'
import React from 'react'
import { Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { AppDispatch, RootState } from '../../store'
import { connect } from 'react-redux'
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase'
import { Action, compose, Dispatch } from 'redux'
import { Link, Redirect } from 'react-router-dom'
import { EditOutlined } from '@mui/icons-material';
import { ClassPageProps } from './ClassPage';
import { fetchPost, threadPageSlice } from './ThreadPageSlice';
import { addComment, addCommentOnComment, deletePost, deleteComment } from '../../store/actions/postActions';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export interface ThreadNode { // Refers to a post or a reply
  // Metadata to track relation between post/replies/nested replies
  ID: string;
  ancestorsIDs: [];
  replies: ThreadNode[];
  // Data to be displayed
  title: string;
  content: string;
  posterUsername?: string;
  posterImgUrl?: string;
  numComments: number;
  timeSincePosted: string;
  isDeleted: boolean;
}

interface ThreadPageProps {
  classID: string;
  postID: string;
  classInfo?: ClassPageProps["classInfo"]
  post?: ThreadNode;
  auth?: FirebaseReducer.AuthState;
  currentUsername?: string;
  isDataFetched?: boolean;
  clearFetchedDocs?: () => void;
  fetchPost?: (classID: string, postID: string) => void;
  deletePost?: (post: any) => void;   // TODO: I type-annotate this hackily since the actual redux action doesn't have proper type annotation  - Raziq
  addComment?: (comment: any) => void;
  addCommentOnComment?: (comment: any) => void
  deleteComment?: (commentID: string) => void;           //DELETE??????????????????
}

interface ThreadPageStates {
  dropdownAnchor: any,
  commentID: string,
  description: string,
  dropdownReplyID: string
}

class ThreadPage extends React.Component<ThreadPageProps, ThreadPageStates> {
  // Initialize state
  constructor(props: ThreadPageProps) {
    super(props);
    this.state = {
      description: "",
      commentID: "",
      dropdownAnchor: null,
      dropdownReplyID: ""
    }
  }

  componentDidMount() {
    const postIsEmptyOrObsolete = () => !this.props.post
      || (this.props.post
        && this.props.post.ID !== this.props.postID)
    if (postIsEmptyOrObsolete()) {
      this.props.clearFetchedDocs()
    }
    this.props.fetchPost(this.props.classID, this.props.postID)
  }

  handleDeletePost = (event: any) => {
    event.preventDefault();
    var result: boolean = window.confirm("Are you sure you want to delete your post?");
    if (result) {
      //user said yes
      this.props.deletePost({ postID: this.props.postID });
      // TODO: Do this in redux action after deletion has actually succeeded / failed
      // TODO: Maybe use this.props.history.push()
      window.alert("Post Deleted Successfully!");
      window.history.back();
    }
    // User said no, do nothing
  }

  handleDeleteComment = (commentID: string) => {
    var result: boolean = window.confirm("Are you sure you want to delete your comment?");
    if (result) {
      //user said yes
      this.props.deleteComment(commentID);  // TODO: Fix the type annotation for deleteComment
    }
    // User said no, do nothing
  }

  handleDropdownClick = (event: React.MouseEvent<HTMLElement>, replyID: string) => {
    this.setState({
      dropdownAnchor: event.currentTarget,
      dropdownReplyID: replyID
    })
  }

  handleDropdownClose = () => {
    this.setState({
      dropdownAnchor: null
    })
  }

  showEditAndDelete() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  showComment() {
    document.getElementById("myComment").classList.toggle("show");
  }

  showComment2(reply: ThreadNode) {
    this.setState({
      commentID: reply.ID,
    })
    document.getElementById(reply.ID).classList.toggle("show");
  }

  // General purpose state updater during form modification
  handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value,
    })
  }

  // Handle user submit
  handleSubmit = (event: any) => {
    event.preventDefault();
    if (this.state.description.length < 10) {
      // Pop modal for description length error
      console.log("Minimum description Length Required: 10 characters");
      window.alert("Minimum description length required: 10 characters")
    }
    else {
      console.log("Posted Successfully!");
      window.alert("Posted successfully!")
      this.props.addComment({
        description: this.state.description,
        postId: this.props.postID,
        classID: this.props.classID
      });
      window.history.back();
    }
  }

  handleChangeDescription2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value,
    })
  }

  // Handle user submit
  handleSubmit2 = (event: any) => {
    event.preventDefault();
    if (this.state.description.length < 10) {
      // Pop modal for description length error
      console.log("Minimum description Length Required: 10 characters");
      window.alert("Minimum description length required: 10 characters")
    }
    else {
      console.log("Posted Successfully!");
      window.alert("Posted successfully!")
      this.props.addCommentOnComment({
        description: this.state.description,
        postId: this.props.postID,
        classID: this.props.classID,
        commentID: this.state.commentID,
      });
      window.history.back();
    }
  }

  getPost = (post: ThreadNode) => {
    var editCode: any = <div></div>;
    var commentCode: any = <div id="myComment" hidden>
      <input type="text" value={this.state.description} placeholder="Tell us more!" id="myComment"
        onChange={this.handleChangeDescription} />
      <div></div>
      <Button
        onClick={this.handleSubmit}
        sx={{
          textTransform: "none", color: "#787c7e", fontWeight: "bold",
          fontSize: "12px", padding: "4px 4px"
        }}
        id="myComment"
        hidden
      >
        Submit
      </Button>
    </div>;
    var userIsPostOwner: boolean = this.props.currentUsername && post.posterUsername == this.props.currentUsername;
    if (userIsPostOwner) {
      editCode = <div>
        <div className="dropdown">
          <Button onClick={this.showEditAndDelete} className="dropbtn">...</Button>
          <div id="myDropdown" className="dropdown-content">
            <Button
              component={Link}
              to={"/edit-post/" + this.props.classID + "/" + this.props.postID}
              variant="outlined"
              sx={{ color: "black", height: "32px" }}
            >
              <EditOutlined sx={{ fontSize: "16px", paddingRight: "4px" }} />
              Edit
            </Button>
            <Button
              onClick={this.handleDeletePost}
              variant="outlined"
              sx={{ color: "black", height: "32px" }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    }
    return (
      <Box display="inline" textAlign="left" padding="0px 4px 0px 4px">
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
          >{post.posterUsername ? post.posterUsername : "[ deleted ]"}&nbsp;
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#787c7e", fontSize: "12px" }}
          >{post.timeSincePosted}
          </Typography>
          {editCode}
        </Box>
        <Typography
          variant="h6"
          sx={{ fontSize: "18px", paddingBottom: "4px", wordWrap: "break-word" }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ paddingBottom: "0px", wordWrap: "break-word" }}
        >
          {post.content}
        </Typography>
        <Box pt="8px">
          <Button
            onClick={this.showComment}
            /*component={Link}
            to={"/createComment/" + this.props.classID + "/" + this.props.postID}*/
            sx={{
              textTransform: "none", color: "#787c7e", fontWeight: "bold",
              fontSize: "12px", padding: "4px 4px"
            }}
          >
            <ChatBubbleOutlineOutlinedIcon
              sx={{ color: "#787c7e", marginRight: "4px", fontSize: "20px" }}
            />
            Reply ({post.numComments} Comments)
          </Button>
          {commentCode}
        </Box>
      </Box>
    )
  }

  getReply = (reply: ThreadNode) => {
    // TODO: Abstract away some operations here into several util functions
    var commentCode: any = <div id={reply.ID} hidden>
      {console.log(this)}
      <input type="text" value={this.state.description} placeholder="Tell us more!" id={reply.ID}
        onChange={this.handleChangeDescription2} />
      <div></div>
      <Button
        onClick={this.handleSubmit2}
        sx={{
          textTransform: "none", color: "#787c7e", fontWeight: "bold",
          fontSize: "12px", padding: "4px 4px"
        }}
        id={reply.ID}
        hidden
      >
        Submit
      </Button>
    </div>;
    var userIsCommentOwner: boolean = this.props.currentUsername && reply.posterUsername == this.props.currentUsername;
    var dropdownMenu: any = <div></div>;
    var showMenu: any = <div></div>;
    if (userIsCommentOwner) {
      const open = Boolean(this.state.dropdownAnchor);

      if (this.state.dropdownReplyID === reply.ID) {
        console.log(reply.ID + " " + this.state.dropdownReplyID)
        showMenu =
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={this.state.dropdownAnchor}
            open={open}
            onClose={this.handleDropdownClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch',
              },
            }}
          >
            <MenuItem component={Link} to={"/classes/" + this.props.classID + "/" + this.props.postID + "/" + reply.ID + "/edit"}>
              {"Edit"}
            </MenuItem>
            <MenuItem onClick={() => this.handleDeleteComment(reply.ID)}>
              {"Delete"}
            </MenuItem>
          </Menu>
      }
      dropdownMenu =
        <div>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => this.handleDropdownClick(event, reply.ID)}
          >
            <MoreHorizIcon sx={{ fontSize: "16px" }} />
          </IconButton>
          {showMenu}
        </div>
    }
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
            {reply.posterUsername ? reply.posterUsername[0] : undefined}
          </Avatar>
          <Typography
            variant="subtitle2"
            sx={{ color: "#000000", fontSize: "12px", fontWeight: "bold" }}
          >
            {(reply.isDeleted || reply.posterUsername === undefined) ? "[ deleted ]" : reply.posterUsername} &nbsp;
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#787c7e", fontSize: "12px" }}
          >{reply.timeSincePosted}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row">
          {/* Vertical line */}
          <Box display="flex" sx={{ color: "#edeff1", "&:hover": { color: "#9CA3AF" } }}>
            <Divider orientation="vertical" flexItem
              sx={{
                margin: "4px 0px 0px 21.5px", color: "inherit", border: "none", borderLeft: "2.3px solid",
              }}
            />
          </Box>
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
                  <Box textAlign="left" ml="22px">
                    <Typography
                      variant="body2"
                      sx={{ paddingBottom: "0px" }}
                    >
                      {reply.content}
                    </Typography>
                    {/* Interaction widgets */}
                    <Box pt="8px" display="flex" flexDirection="row">
                      <Button
                        /*component={Link}
                        to={"/createCommentOnComment/" + this.props.classID + "/" + this.props.postID + "/" + reply.ID}*/
                        onClick={() => this.showComment2(reply)}
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
                      {commentCode}
                      {dropdownMenu}
                    </Box >
                  </Box >

                )
            }
            {
              (reply.replies.length > 0)
              && reply.replies.map((reply_) => this.getReply(reply_))
            }
          </Box >
        </Box >
      </Box >
    )
  }

  getClass(class_: ClassPageProps["classInfo"]) {
    return (
      <Card>
        <Box p="12px 16px" sx={{ background: "#f3f4f6", color: "black" }}>
          Class Info
        </Box>
        <CardContent sx={{ textAlign: "left" }}>
          <label htmlFor="title">Course:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.title}
          </Typography>
          <label htmlFor="title">Department:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.department}
          </Typography>
          {/* <label htmlFor="title">Description:</label> */}
          {/* <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.description}
          </Typography> */}
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
    if (this.props.isDataFetched && this.props.classInfo === undefined)
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
  // Map class object to meet the UI's need
  var classes = state.firestore.ordered.classPageClasses
  var classInfo: ClassPageProps["classInfo"] = (classes !== undefined && classes.length > 0)
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
    post: state.threadPage.post,
    classInfo: classInfo,
    isDataFetched: classes != undefined && state.threadPage.isPostFetched,
    currentUsername: state.auth.lastCheckedUsername,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch, props: ThreadPageProps) => {
  return {
    deletePost: (post: any) => dispatch(deletePost(post)),
    deleteComment: (commentID: string) => dispatch(deleteComment(commentID)),
    fetchPost: (classID: string, postID: string) => dispatch(fetchPost(classID, postID)),
    addComment: (post: any) => dispatch(addComment(post)),
    addCommentOnComment: (post: any) => dispatch(addCommentOnComment(post)),
    clearFetchedDocs: () => dispatch(
      (reduxDispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        reduxDispatch(threadPageSlice.actions.fetchPostBegin())
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