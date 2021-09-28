import './NavBar.css'
import { Link } from 'react-router-dom'
import { signOut } from '../../store/actions/authActions'
import { FirebaseReducer } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@mui/material'

interface NavBarProps {
  auth: FirebaseReducer.AuthState;
  username: string;
  signOut: () => void;
}

interface NavBarState {
}

// TODO: Check if user is logged in and update navbar accordingly
// TODO: Collapsible menu for xs viewport

class NavBar extends Component<NavBarProps, NavBarState> {

  constructor(props: NavBarProps) {
    super(props)
  }

  isLoggedIn() {
    return this.props.auth.uid != undefined
  }

  render() {
    return (
      <div id='topbar'>
        <div id='topbar__gold'>
          <div>
            {!this.isLoggedIn() && <Link to="/signin">Hi, {this.props.username}</Link>}
            {!this.isLoggedIn() && <Link to="/signin">Sign in</Link>}
            {this.isLoggedIn() && <Link to={"/" + this.props.username}>Hi, &nbsp;
              {this.props.username}</Link>}
            {this.isLoggedIn() && <Link to="/" onClick={(e) =>
              this.props.signOut()}>Sign out</Link>}
          </div>
        </div>
        <div id="topbar__black" />
        <div id="topbar__nav">
          <div>
            <Button component={Link} to="/">Home</Button>
            <Button component={Link} to="/events">Event</Button>
            <Button component={Link} to="/market">Market</Button>
            <Button component={Link} to="/life">Life</Button>
            <Button component={Link} to="/classes">Class</Button>
            <Button component={Link} to="/clubs">Club</Button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    username: state.auth.username,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
