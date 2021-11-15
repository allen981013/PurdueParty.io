import React from "react"
import { connect } from "react-redux"
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';
import { compose } from "redux"
import { AppDispatch, RootState } from '../../store';
import { Box, CircularProgress, Grid, Tab, Tabs } from '@mui/material'
import Classes from "./Classes";
import { Post } from "./ClassPage";
import { Redirect } from "react-router-dom";

interface ForumMainPageProps {
  auth: FirebaseReducer.AuthState;
  postsFromAllClasses: Post[];
  postsFromFollowedClasses: Post[];
  isPostsFromAllClassesFetched: boolean;
  isPostsFromFollowedClassesFetched: boolean;
  fetchPostsFromAllClasses: () => void; 
  fetchPostsFromFollowedClasses: () => void;
}

interface ForumMainPageStates {
  currentTabIndex: number;
}

class ForumMainPage extends React.Component<ForumMainPageProps, ForumMainPageStates> {

  constructor(props: ForumMainPageProps) {
    super(props)
    this.state = {
      currentTabIndex: 0,
    }
  }

  componentDidMount() {
    // this.props.fetchPostsFromAllClasses();
    // this.props.fetchPostsFromFollowedClasses();
  }

  getPostsFromAllClassesSubPage() {
    if (!this.props.isPostsFromAllClassesFetched)
      return (
        <Box pt="32px"><CircularProgress /></Box>
      )
    return (
      <Box>
        Main posts
      </Box>
    )
  }
  
  getPostsFromFollowedClassesSubPage() {
    if (!this.props.isPostsFromAllClassesFetched)
      return (
        <Box pt="32px"><CircularProgress /></Box>
      )
    return (
      <Box>
        Main posts
      </Box>
    )
  }

  getClassesSidebar() {

  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    return (
      <Box width="1200px" p="32px 0px 40px" display="flex" flexDirection="column" alignSelf="center">
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <h1 style={{ fontWeight: 300, margin: "0px" }}>Forum</h1>
          <Tabs
            value={this.state.currentTabIndex}
            onChange={(e: any, newIndex: number) => this.setState({ currentTabIndex: newIndex })}
          >
            <Tab label="Followed" />
            <Tab label="All" />
          </Tabs>
        </Box>
        <Grid container>
          <Grid item xs={12} md={9}>
            {this.state.currentTabIndex == 0 && this.getPostsFromFollowedClassesSubPage()}
            {this.state.currentTabIndex == 1 && this.getPostsFromAllClassesSubPage()}
            {/* {this.state.currentTabIndex == 2 && <Classes />} */}
          </Grid>
          <Grid item xs={12} md={3}>

          </Grid>
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
  }
}

export default compose<React.ComponentType<ForumMainPageProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
  ])
)(ForumMainPage)