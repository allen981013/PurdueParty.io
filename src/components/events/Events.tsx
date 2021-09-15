import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    events: state.event.events
    //events: state.firestore.ordered.events
  }
}

/*
const mapDispatchToProps = (dispatch) => {
  // Return functions from actions folder
  return {
    loadEvents : =
  }
}

export default connect(mapState)
*/

export default connect(mapStateToProps)(Events);