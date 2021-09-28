import './NavBar.css'
import { Link } from 'react-router-dom'
import { signOut } from '../../store/actions/authActions'
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

interface NavBarProps {
  auth: FirebaseReducer.AuthState;
  username: string;
  loadUsername: () => void;
  signOut: () => void;
}

interface NavBarState {
  loginStatusUpdated: boolean;
}

// TODO: Check if user is logged in and update navbar accordingly
// TODO: Collapsible menu for xs viewport

class NavBar extends Component<NavBarProps, NavBarState> {

  constructor(props: NavBarProps) {
    super(props)
  }

  updateLoginStatus() {
    this.loadUsername()
    return this.props.auth.uid != undefined
  }

  render() {
    return (
      <div id='topbar'>
        <div id='topbar__gold'>
          <div>
            {!this.updateLoginStatus() && <Link to="/signin">Hello, Guest</Link>}
            {!this.updateLoginStatus() && <Link to="/signin">Sign in</Link>}
            {this.updateLoginStatus() && <Link to={"/" + this.props.username}>Hi, &nbsp;
              {this.props.username}</Link>}
            {this.updateLoginStatus() && <Link to="/" onClick={(e) =>
              this.props.signOut()}>Sign out</Link>}
          </div>
        </div>
        <div id="topbar__black" />
        <div id="topbar__nav">
          <div>
            <Link to="/">Home</Link>
            <Link to="/events">Event</Link>
            <Link to="/market">Market</Link>
            <Link to="/life">Life</Link>
            <Link to="/classes">Class</Link>
            <Link to="/clubs">Club</Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  console.log( state.firestore.ordered.users)
  return {
    auth: state.firebase.auth,
    userName: ""
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Return functions from actions folder
  return {
    signOut: () => dispatch(signOut())
  }
}

export default compose<React.ComponentType<NavBarProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'users' }
  ])
)(NavBar) as any 
