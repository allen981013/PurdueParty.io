import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { deletePost, editPost, editComment } from '../../store/actions/postActions'
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
interface EditCommentState {
  description: string,
  isPrePopulated: boolean
}

// Interface/type for Posts Props
interface EditCommentProps {
  auth: any,
  comment: any,
  match: any,
  editComment: (commentID: string, description: string) => void
}

class EditComment extends Component<EditCommentProps, EditCommentState> {

  // Initialize state
  constructor(props: EditCommentProps) {
    super(props);
    this.state = {
      description: "",
      isPrePopulated: false
    }
  }

  static getDerivedStateFromProps(props: EditCommentProps, state: EditCommentState) {
    if (props.comment !== undefined && !state.isPrePopulated) {
      return ({
        ...state, description: props.comment.content, isPrePopulated: true
      }) 
    }
    return state
  }

  handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value
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

      //console.log(this.state.postId);
      this.props.editComment(this.props.match.params.commentID, this.state.description);
    }
  }



  render() {
    if (!this.props.comment) return <Box>Comment not found</Box>;

    return (
      <div>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
          <Box id="cropped-purdue-img" />
        </Box>

        <form onSubmit={this.handleSubmit}>

          <h1>Enter Comment Description:</h1>
          <div className="input-field">
            <label htmlFor="description">Comment Description: </label>
            <input type="text" value={this.state.description} placeholder="Tell us more!" id="description"
              onChange={this.handleChangeDescription} />
          </div>

          <div className="input-field">
            <button className="button">Edit your Comment</button>
          </div>

        </form>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    auth: state.firebase.auth,
    comment: state.firestore.ordered.comments !== undefined ? state.firestore.ordered.comments[0] : undefined
  }
}

const mapDispatchToProps = (dispatch: (action: any) => void) => {
  // Insert functions from actions folder in similar syntax
  return {
    editComment: (comment: any, description: any) => dispatch(editComment(comment, description))
  }
}

export default compose<React.ComponentType<EditCommentProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: EditCommentProps) => {
    return [
      {
        collection: "posts",
        doc: props.match.params.commentID,
        storeAs: "comments"
      }
    ]
  })
)(EditComment)