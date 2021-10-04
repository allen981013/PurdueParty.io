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

import DateMomentUtils from '@date-io/moment';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { now } from 'moment';

// Interface/type for Events State
interface EventState {
  id: string,
  owner: string,
  editors: string[],
  orgID: string,
  title: string
  description: string,
  location: string,
  dateTime: Date,
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

class CreateEvent extends Component<EventProps, EventState> {

  // Initialize state
  constructor(props:EventProps) {
    super(props);
    this.state = {
      id: "",
      owner: "",
      editors: [""],
      orgID: "None",
      title: "",
      description: "",
      location: "",
      dateTime: new Date(),
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

  handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description : e.target.value
    })
  }

  handleChangeDateTime = (e: any) => {
    console.log("CHANGE DATE\TIME");
    console.log(e);
    this.setState({
      dateTime : e.toDate()
    })
  }

  handleChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      location : e.target.value
    })
  }

  handleChangeOrgID = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      orgID : e.target.value
    })
  }

  handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      type : e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event:any) => {
    event.preventDefault();

    if (this.state.title.length < 3) { 
      // Pop modal for title length error
      console.log("Minimum title length required: 3 characters");
      window.alert("Minimum title length required: 3 characters")
    }
    else if (this.state.description.length < 10) {
        // Pop modal for description length error
        console.log("Minimum description Length Required: 10 characters");
        window.alert("Minimum description length required: 10 characters")
    }
    else if (this.state.dateTime < new Date() ) { //
        // Pop modal if date entered is before now
        console.log("Please enter a valid upcoming date/time");
        window.alert("Please enter a valid upcoming date/time");
    }
    else if (this.state.location.length < 3) {
        // Pop modal for if the location is not 3 chars
        console.log("Minimum location length required: 3 characters");
        window.alert("Minimum location length required: 3 characters");
    }
    else if (this.state.type === "") {
      // Pop modal for no type error
      console.log("Please select type from dropdown");
      window.alert("Please select type from dropdown")
    }
    else if (this.state.orgID === "") {
      // Pop modal for no type error
      console.log("Please select orgID from dropdown");
      window.alert("Please select an organization from the dropdown")
    }
    else {
        console.log("Event Posted Successfully!");
        window.alert("Event posted successfully!")

        this.props.addEvent(this.state);

        this.setState({
          id: "",
          owner: "",
          editors: [""],
          orgID: "",
          title: "",
          description: "",
          location: "",
          dateTime: new Date(),
          postedDateTime: new Timestamp(0,0),
          attendees: [""],
          type: ""
        })
    }
  }

  render() {
    //const {auth} = this.props;
    //if(!auth.uid) return <Redirect to= '/'/>

    return (
      <div>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Box id="cropped-purdue-img"/>
        </Box>
        
        <form onSubmit = {this.handleSubmit}>
          <h1>Enter event title:</h1>
          <div className = "input-field">
            <label htmlFor="title">Event Title: </label>
            <input type ="text" value={this.state.title} placeholder="What do you want your event to be called?" 
                   id="title" onChange={this.handleChangeTitle}/>
          </div>

          <h1>Enter event description:</h1>
          <div className = "input-field">
            <label htmlFor="description">Event description: </label>
            <input type ="text" value={this.state.description} placeholder="What's your event about?" id="description" 
                   onChange={this.handleChangeDescription}/>
          </div>

          <h1>Enter event date and time:</h1>
          <MuiPickersUtilsProvider utils={DateMomentUtils}>
              <DateTimePicker emptyLabel="Choose Date" disablePast={true} value={this.state.dateTime} onChange={this.handleChangeDateTime} onAccept={this.handleChangeDateTime}  />
            </MuiPickersUtilsProvider>

          <h1>Enter event location:</h1>
          <div className = "input-field">
            <label htmlFor="location">Event location: </label>
            <input type ="text" value={this.state.location} placeholder="Where's this going down?" id="location" 
                   onChange={this.handleChangeLocation}/>
          </div>

          <h1>Enter event type:</h1>
          <div className = "input-field">
            <label htmlFor="type">Event type: </label>
            <input type ="text" value={this.state.type} placeholder="What type of event is this?" id="type" onChange={this.handleChangeType}/>
          </div>

          <h1>Enter associated organization:</h1>
          <div className = "input-field">
            <label htmlFor="type">Organization: </label>
            <input type ="text" value={this.state.orgID} placeholder="Who's hosting the party?" id="type" onChange={this.handleChangeOrgID}/>
          </div>

          <div className ="input-field">
            <button className = "button">Create New Event</button>
          </div>
        </form>
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
)(CreateEvent)
