import './NavBar.css'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

interface NavBarProps {
}

interface NavBarState {
  isLoggedIn?: boolean;
  userName?: string;
}

// TODO: Check if user is logged in and update navbar accordingly
// TODO: Collapsible menu for xs viewport

class NavBar extends Component<NavBarProps, NavBarState> {
  render() {
    return (
      <div id='topbar'>
        <div id='topbar__gold'>
          <div>
            <Link to="/signin">Hello, Guest</Link>
            <Link to="/signin">Sign In</Link>
          </div>
        </div>
        <div id="topbar__black">
        </div>
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

const mapStateToProps = (state: any) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: any) => {
  // Return functions from actions folder
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);