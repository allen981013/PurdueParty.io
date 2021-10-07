import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addClub } from '../../store/actions/clubActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Timestamp } from '@firebase/firestore';
import { Redirect } from 'react-router-dom';


// Interface/type for Clubs State
interface ClubState {
  id: string,
  owner: string,
  editors: string[],
  title: string
  description: string,
  contactInfo: string,
  postedDateTime: Timestamp,
  attendees: string[],
  type: string,
  event: string[]
}

// Interface/type for Clubs Props
interface ClubProps {
  auth: any,
  clubs: any,
  addClub: (state: ClubState) => void
}

class Clubs extends Component<ClubProps, ClubState> {

  // Initialize state
  constructor(props: ClubProps) {
    super(props);
    this.state = {
      id: "",
      owner: "",
      editors: [""],
      title: "",
      description: "",
      contactInfo: "",
      postedDateTime: new Timestamp(0, 0),
      attendees: [""],
      type: "",
      event: [""]
    };
  }

  // General purpose state updater during form modification
  handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event: any) => {
    event.preventDefault();
    this.props.addClub(this.state);

    this.setState({
      id: "",
      owner: "",
      editors: [""],
      title: "",
      description: "",
      contactInfo: "",
      postedDateTime: new Timestamp(0, 0),
      attendees: [""],
      type: "",
      event: [""]
    })
  }

  render() {
    const { auth } = this.props;
    if (!auth) return <Redirect to='/signin' />

    console.log(this.props.clubs);
    console.log(this.state);
    return (
      <div>
        <div>
          <h1> Purdue Clubs </h1>
        </div>
        <div>
          <a href="/clubs/create-club">Create a new club</a>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    clubs: state.firestore.ordered.clubs,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    addClub: (club: any) => dispatch(addClub(club))
  }
}

export default compose<React.ComponentType<ClubProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'clubs' }
  ])
)(Clubs)