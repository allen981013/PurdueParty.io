import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { deletePost, editPost } from '../../store/actions/postActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Timestamp } from '@firebase/firestore';
import { IconButton, Grid, Box, Button } from '@mui/material';
import ReactModal from 'react-modal';

import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { StayCurrentPortraitSharp } from '@mui/icons-material';

var updated: boolean;

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
}

// Interface/type for Posts Props
interface PostProps {
  auth: any,
  posts: any,
  match: any,
  editPost: (state: PostState) => void
}

class EditPost extends Component<PostProps, PostState> {

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
    }
  }

  // General purpose state updater during form modification
  handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value,
      classID: this.props.match.params.classID,
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

      //console.log(this.state.postId);
      this.props.editPost({...this.state, postId: this.props.match.params.postID});

      this.setState({
        postId: this.props.match.params.postID,
        owner: this.state.owner,
        classID: this.props.match.params.classID,
        title: this.state.title,
        description: this.state.description,
        postedDateTime: new Timestamp(0,0),
        upvotes: 1,
        downvotes: 0,
        comments: this.state.comments,
      })
    }
  }

  isPost = (post:any) => {
    if (this.props.posts) {
      return post.postId === this.props.match.params.postID
    } else {
      return false;
    }
  }

  render() {
    if (!this.props.posts) return <Box>Post not found</Box>;
    if(!updated){
      const curPost = this.props.posts.find(this.isPost);
      console.log(curPost);
      if (curPost != null) {
        this.setState({
          title: curPost.title,
          description: curPost.content,
        })
      }
      updated = true;
    }
    return (
      <div>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
          <Box id="cropped-purdue-img" />
        </Box>

        <form onSubmit={this.handleSubmit}>
          <h1>Enter Post Title:</h1>
          <div className="input-field">
            <label htmlFor="title">Post Title: </label>
            <input type="text" value={this.state.title} placeholder="What's your post about?"
              id="title" onChange={this.handleChangeTitle} />
          </div>

          <h1>Enter Post Description:</h1>
          <div className="input-field">
            <label htmlFor="description">Post Description: </label>
            <input type="text" value={this.state.description} placeholder="Tell us more!" id="description"
              onChange={this.handleChangeDescription} />
          </div>

          <div className="input-field">
            <button className="button">Edit your post</button>
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
    editPost: (post: any) => dispatch(editPost(post))
  }
}

export default compose<React.ComponentType<PostProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { 
      collection: 'posts'
    }
  ])
)(EditPost)