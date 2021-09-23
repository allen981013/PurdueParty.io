import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addEvent } from '../../store/actions/eventActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom'

// Interface/type for Events State
interface EventState {
  id: number,
  title: string
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
      id: 0,
      title: ""
    };
  }

  // General purpose state updater during form modification
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title : e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event:any) => {
    event.preventDefault();
    this.props.addEvent(this.state);
    this.setState({
      id: 0,
      title: ""
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
        <form onSubmit = {this.handleSubmit}>
          <h1>Enter event title:</h1>
          <div className = "input-field">
            <label htmlFor="title">Event Title: </label>
            <input type ="text" value={this.state.title} id="title" onChange={this.handleChange}/>
          </div>
          <div className ="input-field">
            <button className = "button">Create New Event</button>
          </div>
        </form>
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