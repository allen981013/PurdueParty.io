import './NavBar.css'
import { Link } from 'react-router-dom'
import { refreshUserData, signOut } from '../../store/actions/authActions'
import { FirebaseReducer } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Box, Button, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Menu } from '@mui/icons-material'

interface NavBarProps {
  auth: FirebaseReducer.AuthState;
  username: string;
  refreshUserData: () => void;
  signOut: () => void;
}

interface NavBarState {
  isCollapsibleMenuOpen: boolean;
}

// TODO: Check if user is logged in and update navbar accordingly
// TODO: Collapsible menu for xs viewport

class NavBar extends Component<NavBarProps, NavBarState> {

  constructor(props: NavBarProps) {
    super(props)
    this.state = {
      isCollapsibleMenuOpen: false,
    }
  }

  componentDidMount() {
    this.props.refreshUserData()
  }

  isLoggedIn() {
    return this.props.auth.uid != undefined
  }

  handleCollapsibleMenuClick = (e: any) => {
    this.setState((state, props) => {
      return { ...state, isCollapsibleMenuOpen: !state.isCollapsibleMenuOpen }
    })
  }

  handleSignOutClick = (e: any) => {
    this.props.signOut()
  }

  getGreetingOrAuthButton(text: string, href: string, onClickHandler?: (e: any) => void) {
    return onClickHandler === undefined
      ? <Button component={Link}
        to={href}
        sx={{ textTransform: "unset", fontWeight: "light", textDecoration: "underline !important" }}
      >{text}
      </Button>
      : <Button component={Link}
        to={href}
        onClick={onClickHandler}
        sx={{ textTransform: "unset", fontWeight: "light", textDecoration: "underline !important" }}
      >{text}
      </Button>
  }

  render() {
    return (
      <div id='topbar'>
        <div id='topbar__gold'>
          <div>
            {!this.isLoggedIn() && this.getGreetingOrAuthButton("Hi, " + this.props.username, "/signin")}
            {!this.isLoggedIn() && this.getGreetingOrAuthButton("Sign in", "/signin")}
            {this.isLoggedIn() && this.getGreetingOrAuthButton("Hi, " + this.props.username, "/profile")}
            {this.isLoggedIn() && this.getGreetingOrAuthButton("Sign out", "/", this.handleSignOutClick)}
          </div>
        </div>
        <div id="topbar__black" />
        <div id="topbar__nav">
          <Box sx={{ display: { xs: "none !important", sm: "flex !important" }, height: "50px" }}>
            <Button component={Link} to="/">Home</Button>
            <Button component={Link} to="/events">Events</Button>
            <Button component={Link} to="/marketplace">Market</Button>
            <Button component={Link} to="/life">Life</Button>
            <Button component={Link} to="/classes">Classes</Button>
            <Button component={Link} to="/clubs">Clubs</Button>
          </Box>
          <List
            sx={{
              width: '100%',
              maxWidth: 150,
              display: { sm: "none", padding: "0px" }
            }}
            component="nav"
          >
            <ListItemButton
              // sx={{ height: "40px" }}
              onClick={this.handleCollapsibleMenuClick}
            >
              <ListItemIcon><Menu /></ListItemIcon>
              <ListItemText>Menu</ListItemText>
            </ListItemButton>
            <Collapse
              in={this.state.isCollapsibleMenuOpen}
              orientation={"vertical"}
            >
              <ListItemButton alignItems={"center"} component={Link} to="/">
                <ListItemText>Home</ListItemText>
              </ListItemButton>
              <ListItemButton alignItems={"center"} component={Link} to="/events">
                <ListItemText>Event</ListItemText>
              </ListItemButton>
              <ListItemButton alignItems={"center"} component={Link} to="/market">
                <ListItemText>Market</ListItemText>
              </ListItemButton>
              <ListItemButton alignItems={"center"} component={Link} to="/life">
                <ListItemText>Life</ListItemText>
              </ListItemButton>
              <ListItemButton alignItems={"center"} component={Link} to="/classes">
                <ListItemText>Class</ListItemText>
              </ListItemButton>
              <ListItemButton alignItems={"center"} component={Link} to="/clubs">
                <ListItemText>Clubs</ListItemText>
              </ListItemButton>
            </Collapse>
          </List>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    username: state.auth.lastCheckedUsername ? state.auth.lastCheckedUsername : "guest",
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    refreshUserData: () => dispatch(refreshUserData()),
    signOut: () => dispatch(signOut()),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
