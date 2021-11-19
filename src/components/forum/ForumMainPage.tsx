import React from "react"
import { connect } from "react-redux"
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';
import { compose } from "redux"
import { AppDispatch, RootState } from '../../store';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Tab, Tabs, Typography } from '@mui/material'
import Classes from "./Classes";
import { getPostCardComponent, Post } from "./ClassPage";
import { Link, Redirect } from "react-router-dom";
import { fetchPostsFromAllClasses, fetchPostsFromFollowedClasses } from "./ForumMainPageSlice";

interface ForumMainPageProps {
  auth: FirebaseReducer.AuthState;
  postsFromAllClasses: Post[];
  postsFromFollowedClasses: Post[];
  fetchErrForPostsFromFollowedClasses: string;
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
    this.props.fetchPostsFromAllClasses();
    this.props.fetchPostsFromFollowedClasses();
  }

  getPostComponent(post: Post) {
    return getPostCardComponent(post)
  }

  getSubPageForPostsFromAllClasses() {
    if (this.props.postsFromAllClasses == null)
      return (
        <Box pt="32px"><CircularProgress /></Box>
      )
    return (
      <Box pt="32px">
        {this.props.postsFromAllClasses.length != 0
          && this.props.postsFromAllClasses.map((post: Post) => this.getPostComponent(post))}
        {this.props.postsFromAllClasses.length == 0
          && "No posts have been created yet"}
      </Box>
    )
  }

  getSubPageForPostsFromFollowedClasses() {
    if (this.props.postsFromFollowedClasses == null)
      return (
        <Box pt="32px"><CircularProgress /></Box>
      )
    return (
      <Box pt="32px">
        {this.props.postsFromFollowedClasses.length == 0
          && "The forums you joined do not have any posts yet"}
        {this.props.postsFromFollowedClasses.length != 0
          && this.props.postsFromFollowedClasses.map((post: Post) => this.getPostComponent(post))}
      </Box>
    )
  }

  getClassesSidebar() {
    return (
      <Box mt="80px">
        {/* <Box> */}
        <Card>
          <Box
            p="12px 16px"
            sx={{ background: "#f3f4f6", color: "black", fontSize: "15px" }}
          >
            My classes
          </Box>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography noWrap variant="body2" component="div">
              {"You haven't joined any classes yet."}
            </Typography>
            <Button component={Link} to="/forum/all/">Find classes</Button>
          </CardContent>
        </Card>
      </Box >
    )
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    return (
      <Box width="1200px" p="40px 0px 40px" display="flex" flexDirection="column" alignSelf="center">
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
              <h1 style={{ fontWeight: 300, margin: "0px" }}>Timeline</h1>
              <Tabs
                value={this.state.currentTabIndex}
                onChange={(e: any, newIndex: number) => this.setState({ currentTabIndex: newIndex })}
              >
                <Tab label="Followed" />
                <Tab label="Global" />
              </Tabs>
            </Box>
            {this.state.currentTabIndex == 0 && this.getSubPageForPostsFromFollowedClasses()}
            {this.state.currentTabIndex == 1 && this.getSubPageForPostsFromAllClasses()}
            {/* {this.state.currentTabIndex == 2 && <Classes />} */}
          </Grid>
          <Grid item xs={12} md={3}>
            {this.getClassesSidebar()}
          </Grid>
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    postsFromFollowedClasses: state.forumMainPage.postsFromFollowedClasses,
    postsFromAllClasses: state.forumMainPage.postsFromAllClasses,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    fetchPostsFromAllClasses: () => dispatch(fetchPostsFromAllClasses()),
    fetchPostsFromFollowedClasses: () => dispatch(fetchPostsFromFollowedClasses()),
  }
}

export default compose<React.ComponentType<ForumMainPageProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
  ])
)(ForumMainPage)