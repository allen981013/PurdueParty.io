import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addEvent } from '../../store/actions/eventActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Timestamp } from '@firebase/firestore';
import {Redirect} from 'react-router-dom'

// Interface/type for Events State
interface EventState {
  id: string,
  owner: string,
  editors: string[],
  orgID: string,
  title: string
  description: string,
  location: string,
  dateTime: Timestamp,
  postedDateTime: Timestamp,
  attendees: string[],
  type: string,
}

// Interface/type for Events Props
interface EventProps {
    auth: any,
    events: any,
    addEvent: (state:EventState) => void
}

class Events extends Component<EventProps, EventState> {

  // Initialize state
  constructor(props:EventProps) {
    super(props);
    this.state = {
      id: "",
      owner: "",
      editors: [""],
      orgID: "",
      title: "",
      description: "",
      location: "",
      dateTime: new Timestamp(0,0),
      postedDateTime: new Timestamp(0,0),
      attendees: [""],
      type: ""
    };
  }

  // General purpose state updater during form modification
  handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title : e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event:any) => {
    event.preventDefault();

    this.props.addEvent(this.state);

    this.setState({
      id: "",
      owner: "",
      editors: [""],
      orgID: "",
      title: "",
      description: "",
      location: "",
      dateTime: new Timestamp(0,0),
      postedDateTime: new Timestamp(0,0),
      attendees: [""],
      type: ""
    })
  }

  render() {
    return (
      <div>
        <div>
           <h1> Purdue Events </h1>
        </div>
        <div>
            <a href="/create-event">Create a new event</a>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => {
  return {
    auth: state.firebase.auth,

    events: state.firestore.ordered.events
  }
}

const mapDispatchToProps = (dispatch: (action: any) => void) => {
  // Insert functions from actions folder in similar syntax
  return {
    addEvent: (event:any) => dispatch(addEvent(event))
  }
}

export default compose<React.ComponentType<EventProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'events'}
  ])
)(Events)