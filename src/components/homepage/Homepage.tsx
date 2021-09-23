import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addEvent } from '../../store/actions/eventActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';

// Interface/type for Events State
interface HomepageState {

}

// Interface/type for Events Props
interface HomepageProps {
    
}

class Homepage extends Component<HomepageProps, HomepageState> {

  // Initialize state
  constructor(props:HomepageProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Homepage</h1>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth
  }
}

export default compose<React.ComponentType<HomepageProps>>(
  connect(mapStateToProps)
)(Homepage)