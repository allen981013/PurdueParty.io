import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addEvent } from '../../store/actions/eventActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Timestamp } from '@firebase/firestore';
import { IconButton, Grid, Box } from '@mui/material';
import ReactModal from 'react-modal';
import { ArrowForwardOutlined } from "@mui/icons-material";
import { Link } from 'react-router-dom';

// Interface/type for Events State
interface EventState {
  id: string,
  owner: string,
  editors: string[],
  orgID: string,
  title: string
  description: string,
  location: string,
  startTime: Date,
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
      startTime: new Date(),
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
      startTime: new Date(0),
      postedDateTime: new Timestamp(0,0),
      attendees: [""],
      type: ""
    })
  }

  render() {

    console.log(this.props.events);
    console.log(this.state);

    const { auth } = this.props;
    console.log(auth);
    if (!auth.uid) return <Redirect to= '/signin'/>

    return (
      <div>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Box id="cropped-purdue-img"/>
        </Box>
        
        <div>
           <h1> Purdue Events </h1>
        </div>
        <div>
            <a href="events/create-event">Create a new event</a>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    //events: state.event.events
    events: state.firestore.ordered.events,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
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
