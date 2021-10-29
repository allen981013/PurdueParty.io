import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addCommentOnComment } from '../../store/actions/postActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Timestamp } from '@firebase/firestore';
import { IconButton, Grid, Box } from '@mui/material';
import ReactModal from 'react-modal';

import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';

// Interface/type for Posts State
interface PostState {
  postId: string,
  owner: string,
  classID: string,
  title: string
  description: string,
  postedDateTime: Timestamp,
  upvotes: number,
  downvotes: number,
  comments: any[],
  commentID: string,
}

// Interface/type for Posts Props
interface PostProps {
  auth: any,
  posts: any,
  match: any,
  addCommentOnComment: (state: PostState) => void
}

class AddCommentOnComment extends Component<PostProps, PostState> {

  // Initialize state
  constructor(props: PostProps) {
    super(props);
    this.state = {
        postId: "",
        owner: "",
        classID: "",
        title: "",
        description: "",
        postedDateTime: new Timestamp(0,0),
        upvotes: 1,
        downvotes: 0,
        comments: [],
        commentID: "",
    };
  }

  // General purpose state updater during form modification
  handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value,
      classID: this.props.match.params.classID,
      postId: this.props.match.params.postID,
      commentID: this.props.match.params.commentID,
    })
  }

  handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event: any) => {
    event.preventDefault();

    if (this.state.title.length < 10) {
      // Pop modal for title length error
      console.log("Minimum title length required: 10 characters");
      window.alert("Minimum title length required: 10 characters")
    }
    else if (this.state.description.length < 10) {
      // Pop modal for description length error
      console.log("Minimum description Length Required: 10 characters");
      window.alert("Minimum description length required: 10 characters")
    }
    else {
      console.log("Posted Successfully!");
      window.alert("Posted successfully!")


      this.props.addCommentOnComment(this.state);

      this.setState({
        postId: "",
        owner: "",
        classID: "",
        title: "",
        description: "",
        postedDateTime: new Timestamp(0,0),
        upvotes: 1,
        downvotes: 0,
        comments: [],
      })
    }
  }
  

  render() {
    return (
      <div>
        {console.log(this.props.match.params.classID)}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
          <Box id="cropped-purdue-img" />
        </Box>

        <form onSubmit={this.handleSubmit}>
          <h1>Enter Comment Title:</h1>
          <div className="input-field">
            <label htmlFor="title">Comment Title: </label>
            <input type="text" value={this.state.title} placeholder="What's your post about?"
              id="title" onChange={this.handleChangeTitle} />
          </div>

          <h1>Enter Comment Description:</h1>
          <div className="input-field">
            <label htmlFor="description">Comment Description: </label>
            <input type="text" value={this.state.description} placeholder="Tell us more!" id="description"
              onChange={this.handleChangeDescription} />
          </div>

          <div className="input-field">
            <button className="button">Submit your comment</button>
          </div>

        </form>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    auth: state.firebase.auth,
    posts: state.firestore.ordered.posts
  }
}

const mapDispatchToProps = (dispatch: (action: any) => void) => {
  // Insert functions from actions folder in similar syntax
  return {
    addCommentOnComment: (post: any) => dispatch(addCommentOnComment(post))
  }
}

export default compose<React.ComponentType<PostProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { 
      collection: 'posts'
    }
  ])
)(AddCommentOnComment)