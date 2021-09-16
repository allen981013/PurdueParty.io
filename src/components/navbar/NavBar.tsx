import './NavBar.css'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/reducers';

interface NavBarProps {
}

interface NavBarState {
    isLoggedIn?: boolean;
    userName?: string;
}

class NavBar extends Component<NavBarProps, NavBarState> {
  render() {
    return (
      <div id='topbar'>
          <div id='topbar__gold'>
            <div>
              <a href="/signin">Hello, Guest</a> 
              <a href="/signin">Sign In</a>
            </div>
          </div>
          <div id="topbar__black">
          </div>
          <div id="topbar__nav">
            <div>
              <a href="/">Home</a>
              <a href="/events">Event</a>
              <a href="/market">Market</a>
              <a href="/life">Life</a>
              <a href="/classes">Class</a>
              <a href="/clubs">Club</a>
            </div>
         </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: any) => {
  // Return functions from actions folder
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);