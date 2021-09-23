import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addEvent } from '../../store/actions/eventActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Timestamp } from '@firebase/firestore';

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

  handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description : e.target.value
    })
  }

  handleChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      location : e.target.value
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
    console.log(this.props.events);
    console.log(this.state);
    return (
      <div>
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
    //events: state.event.events
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