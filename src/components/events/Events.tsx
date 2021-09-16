import { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addEvent } from '../../store/actions/eventActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

// Interface/type for Events State
interface EventState {
  id: number,
  title: string
}

// Interface/type for Events Props
interface EventProps {
    events: any
}

class Events extends Component<EventProps, EventState> {
  render() {
    /*
        querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().title}`);
    });
    */
    console.log(this.props.events);
    return (
      <div>
        <h1>Sample</h1>
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

const mapDispatchToProps = (dispatch:Dispatch<Action>) => {
  // Return functions from actions folder
  return {
    addEvent: (event:any) => dispatch(addEvent(event))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'events'}
  ])
)(Events);