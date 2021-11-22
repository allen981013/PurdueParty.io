import React from "react"
import { connect } from "react-redux"
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';
import { compose } from "redux"
import { AppDispatch, RootState } from '../../store';
import { Box, Button, Card, CardActionArea, CardContent, CircularProgress, Grid, Tab, Tabs, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link, Redirect } from "react-router-dom";
import { fetchAllClassesPosts, fetchCurUserPosts, fetchJoinedClasses, fetchJoinedClassesPosts } from "./ForumMainPageSlice";
import { Post } from "./ClassPage";

export interface Class {
  title: string;
  href: string;
}

interface ForumMainPageProps {
  auth: FirebaseReducer.AuthState;
  allClassesPosts: Post[];
  joinedClassesPosts: Post[];
  curUserPosts: Post[];
  joinedClasses: Class[];
  fetchJoinedClasses: () => void;
  fetchAllClassesPosts: () => void;
  fetchJoinedClassesPosts: () => void;
  fetchCurUserPosts: () => void;
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
    this.props.fetchJoinedClasses()
    this.props.fetchAllClassesPosts();
    this.props.fetchJoinedClassesPosts();
    this.props.fetchCurUserPosts();
  }

  getPostComponent(post: Post) {
    // Get UI for post cards
    return (
      <Grid
        item
        xs={12}
        md={12}
      >
        <Card sx={{ marginBottom: "16px" }}>
          <CardActionArea disableRipple component={Link} to={post.href}>
            <CardContent sx={{ textAlign: "left" }}>
              <Box display="flex" flexDirection="row" pb="4px">
                {/* Note: We split the following text into separate tags in case we want to 
                  proceed with the idea of making username & time clickable` */}
                <Typography
                  noWrap
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px", fontWeight: "bold" }}
                >{post.classID}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px" }}
                >&nbsp;.&nbsp;Posted by&nbsp;
                </Typography>
                <Typography
                  noWrap
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px" }}
                >{post.poster ? post.poster : "[ deleted ]"}&nbsp;
                </Typography>
                <Typography
                  noWrap
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px" }}
                >{post.timeSincePosted}
                </Typography>
              </Box>
              <Typography
                noWrap
                variant="h6"
                sx={{ fontSize: "18px", paddingBottom: "4px" }}
              >
                {post.title}
              </Typography>
              <Typography
                noWrap
                variant="body2"
                sx={{ paddingBottom: "0px" }}
              >
                {post.content}
              </Typography>
              <Box pt="8px" position="relative">
                <Button
                  onClick={e => { e.stopPropagation(); e.preventDefault() }}
                  sx={{ textTransform: "none", color: "#787c7e", fontWeight: "bold", fontSize: "12px" }}
                >
                  <ChatBubbleOutlineOutlinedIcon
                    sx={{ color: "#787c7e", marginRight: "4px", fontSize: "20px" }}
                  />
                  {post.numComments} Comments
                </Button>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid >
    )
  }

  getSubPageForPosts(posts?: Post[]) {
    if (posts == null)
      return (
        <Box pt="192px"><CircularProgress /></Box>
      )
    return (
      <Box pt="32px">
        {posts.length == 0
          && <Box pt="192px">No posts have been created yet</Box>}
        {posts.length != 0
          && posts.map((post) => this.getPostComponent(post))}
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
          <CardContent
            sx={{ textAlign: this.props.joinedClasses && this.props.joinedClasses.length > 0 ? "left" : "center" }}
          >
            {!this.props.joinedClasses
              && <Box p="32px"><CircularProgress /></Box>}
            {this.props.joinedClasses
              && this.props.joinedClasses.length == 0
              && <Typography noWrap variant="body2" sx={{ padding: "16px 0px" }}>
                You haven't joined any classes yet.
              </Typography>}
            {this.props.joinedClasses
              && this.props.joinedClasses.length != 0
              && this.props.joinedClasses.map(class_ =>
                <Typography
                  component={Link}
                  to={class_.href}
                  variant="body2"
                  sx={{ color: "#00000099", padding: "12px 4px" }}
                >{class_.title}
                </Typography>)
            }
          </CardContent>
        </Card>
        <Button
          component={Link}
          to="/forum/all/"
          variant="outlined"
          // sx={{ marginTop: "16px", width: "100%", color: "#00000099", borderColor: "#f3f4f6" }}
          // sx={{ marginTop: "16px", width: "100%", color: "#00000090", borderColor: "#00000090" }}
          sx={{ marginTop: "16px", width: "100%" }}
        >
          <SearchIcon sx={{ fontSize: "18px", marginRight: "4px" }} />
          Find classes
        </Button>
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
                <Tab label="My Posts" />
              </Tabs>
            </Box>
            {this.state.currentTabIndex == 0 && this.getSubPageForPosts(this.props.joinedClassesPosts)}
            {this.state.currentTabIndex == 1 && this.getSubPageForPosts(this.props.allClassesPosts)}
            {this.state.currentTabIndex == 2 && this.getSubPageForPosts(this.props.curUserPosts)}
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
    joinedClassesPosts: state.forumMainPage.joinedClassesPosts,
    allClassesPosts: state.forumMainPage.allClassesPosts,
    curUserPosts: state.forumMainPage.curUserPosts,
    joinedClasses: state.forumMainPage.joinedClasses,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    fetchJoinedClasses: () => dispatch(fetchJoinedClasses()),
    fetchAllClassesPosts: () => dispatch(fetchAllClassesPosts()),
    fetchJoinedClassesPosts: () => dispatch(fetchJoinedClassesPosts()),
    fetchCurUserPosts: () => dispatch(fetchCurUserPosts()),
  }
}

export default compose<React.ComponentType<ForumMainPageProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
  ])
)(ForumMainPage)