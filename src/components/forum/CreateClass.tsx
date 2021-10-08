import React, { Component } from 'react';
import { compose } from 'redux';
import { addClass } from '../../store/actions/postActions';
import { deleteAccount } from '../../store/actions/authActions';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom'
import { Box } from '@mui/material';

interface CreateClassState {
  courseID: string,
  title: string
}

// Interface/type for EditProfile Props
interface CreateClassProps {
  auth: any,
  firebase: any,
  addClass: (state: CreateClassState) => void
}

class CreateClass extends Component<CreateClassProps, CreateClassState> {

  constructor(props: CreateClassProps) {
    super(props);
    this.state = {
      courseID: "",
      title: ""
    }
  }

  handleChangeID = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      courseID: e.target.value
    })
  }

  handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value
    })
  }

  handleSubmit = (event: any) => {
    event.preventDefault();

    if (this.state.courseID.length > 10) {
      // Pop modal for title length error
      console.log("Course ID should ont longer than 10 characters.");
      window.alert("Course ID should ont longer than 10 characters.")
    }
    else if (this.state.title.length < 5) {
      // Pop modal for description length error
      console.log("Minimum Title Length Required: 3 characters");
      window.alert("Minimum Title length required: 3 characters")
    }
    else {
      console.log("Class has been added!");
      window.alert("Class has been added");

      this.props.addClass(this.state);

      this.setState({
        courseID: "",
        title: ""
      })
    }
  }

  render() {
    const { auth } = this.props;

    if (!auth.uid) return <Redirect to='/signin' />

    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
        <p></p>
        <form onSubmit={this.handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1>Course ID</h1>
          <div className="input-field">
            <input type="text" value={this.state.courseID} placeholder=""
              id="title" onChange={this.handleChangeID} />
          </div>

          <h1>Title</h1>
          <div className="input-field">
            <input type="text" value={this.state.title} placeholder=""
              id="title" onChange={this.handleChangeTitle} />
          </div>

          <div className="input-field">
            <button className="button">Submit</button>
          </div>

        </form>
      </Box>
    )
  }
}


const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    classes: state.firestore.ordered.classes,
  }
}

const mapDispatchToProps = (dispatch: (action: any) => void) => {
  return {
    addClass: (classes: any) => dispatch(addClass(classes))
  }
}

export default compose<React.ComponentType<CreateClassProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'classes' }
  ])
)(CreateClass)