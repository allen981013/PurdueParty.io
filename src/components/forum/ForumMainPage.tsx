import React from "react"
import { connect } from "react-redux"
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';
import { compose } from "redux"
import { AppDispatch, RootState } from '../../store';
import { Box, Button, Card, CardActionArea, CardContent, CircularProgress, Grid, styled, Tab, Tabs, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link, Redirect } from "react-router-dom";
import { fetchAllClassesPosts, fetchCurUserPosts, fetchJoinedClasses, fetchJoinedClassesPosts, FetchCriteria } from "./ForumMainPageSlice";
import { Post } from "./ClassPage";
import WhatshotIcon from '@mui/icons-material/Whatshot';
import StarRateIcon from '@mui/icons-material/StarRate';
import ThumbsUpIcon from '@mui/icons-material/ThumbUp';

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
  fetchAllClassesPosts: (fetchCriteria: FetchCriteria) => void;
  fetchJoinedClassesPosts: (fetchCriteria: FetchCriteria) => void;
  fetchCurUserPosts: (fetchCriteria: FetchCriteria) => void;
}

interface ForumMainPageStates {
  currentTabIndex: number;
  sortBy: FetchCriteria["sortBy"];
}

class ForumMainPage extends React.Component<ForumMainPageProps, ForumMainPageStates> {

  fetchCriteria: FetchCriteria = { sortBy: "RECENCY" }

  constructor(props: ForumMainPageProps) {
    super(props)
    this.state = {
      sortBy: "RECENCY",
      currentTabIndex: 0,
    }
  }

  componentDidMount() {
    this.props.fetchJoinedClasses();
    this.props.fetchAllClassesPosts(this.fetchCriteria);
    this.props.fetchCurUserPosts(this.fetchCriteria);
    this.props.fetchJoinedClassesPosts(this.fetchCriteria);
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
    console.log(posts)
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
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: this.props.joinedClasses && this.props.joinedClasses.length > 0 ?
                "flex-start" :
                "center",

            }}
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
                  sx={{ color: "#00000099", padding: "8px 4px" }}
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

  getSortingBar() {
    // Create a mui theme
    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
      '& .MuiToggleButtonGroup-grouped': {
        margin: "12px",
        padding: "8px 16px",
        border: 0,
        display: "flex",
        alignItems: "center",
        '&:not(:first-of-type)': {
          borderRadius: "20px",
        },
        '&:first-of-type': {
          borderRadius: "20px",
        },
      },
    }));
    // Return the sorting bar
    return (
      <Box display="flex" mb="16px" width="100%">
        <Card sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
          <StyledToggleButtonGroup
            size="small"
            value={this.state.sortBy}
            exclusive
            onChange={(_, newVal: FetchCriteria["sortBy"]) => {
              if (newVal === null) return
              this.setState({ sortBy: newVal })
              this.fetchCriteria.sortBy = newVal
              this.props.fetchCurUserPosts(this.fetchCriteria)
            }}
          >
            <ToggleButton value={"RECENCY"}>
              <StarRateIcon sx={{ paddingRight: "4px" }} />
              New
            </ToggleButton>
            <ToggleButton value={"POPULARITY"}>
              <WhatshotIcon sx={{ paddingRight: "4px" }} />
              Popular
            </ToggleButton>
            <ToggleButton value={"HOT"}>
              <ThumbsUpIcon sx={{ paddingRight: "4px" }} />
              Hot
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Card>
      </Box >
    )
  }

  getSortingBarAll() {
    // Create a mui theme
    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
      '& .MuiToggleButtonGroup-grouped': {
        margin: "12px",
        padding: "8px 16px",
        border: 0,
        display: "flex",
        alignItems: "center",
        '&:not(:first-of-type)': {
          borderRadius: "20px",
        },
        '&:first-of-type': {
          borderRadius: "20px",
        },
      },
    }));
    // Return the sorting bar
    console.log(this.fetchCriteria);
    return (
      <Box display="flex" mb="16px" width="100%">
        <Card sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
          <StyledToggleButtonGroup
            size="small"
            value={this.state.sortBy}
            exclusive
            onChange={(_, newVal: FetchCriteria["sortBy"]) => {
              if (newVal === null) return
              this.setState({ sortBy: newVal })
              this.fetchCriteria.sortBy = newVal
              this.props.fetchAllClassesPosts(this.fetchCriteria)
            }}
          >
            <ToggleButton value={"RECENCY"}>
              <StarRateIcon sx={{ paddingRight: "4px" }} />
              New
            </ToggleButton>
            <ToggleButton value={"POPULARITY"}>
              <WhatshotIcon sx={{ paddingRight: "4px" }} />
              Popular
            </ToggleButton>
            <ToggleButton value={"HOT"}>
              <ThumbsUpIcon sx={{ paddingRight: "4px" }} />
              Hot
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Card>
      </Box >
    )
  }

  getSortingBarJoined() {
    // Create a mui theme
    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
      '& .MuiToggleButtonGroup-grouped': {
        margin: "12px",
        padding: "8px 16px",
        border: 0,
        display: "flex",
        alignItems: "center",
        '&:not(:first-of-type)': {
          borderRadius: "20px",
        },
        '&:first-of-type': {
          borderRadius: "20px",
        },
      },
    }));
    // Return the sorting bar
    return (
      <Box display="flex" mb="16px" width="100%">
        <Card sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
          <StyledToggleButtonGroup
            size="small"
            value={this.state.sortBy}
            exclusive
            onChange={(_, newVal: FetchCriteria["sortBy"]) => {
              if (newVal === null) return
              this.setState({ sortBy: newVal })
              this.fetchCriteria.sortBy = newVal
              this.props.fetchJoinedClassesPosts(this.fetchCriteria)
            }}
          >
            <ToggleButton value={"RECENCY"}>
              <StarRateIcon sx={{ paddingRight: "4px" }} />
              New
            </ToggleButton>
            <ToggleButton value={"POPULARITY"}>
              <WhatshotIcon sx={{ paddingRight: "4px" }} />
              Popular
            </ToggleButton>
            <ToggleButton value={"HOT"}>
              <ThumbsUpIcon sx={{ paddingRight: "4px" }} />
              Hot
            </ToggleButton>
          </StyledToggleButtonGroup>
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
                <Tab label="Followed" onClick={() => this.props.fetchJoinedClassesPosts(this.fetchCriteria)}/>
                <Tab label="Global" onClick={() => this.props.fetchAllClassesPosts(this.fetchCriteria)}/>
                <Tab label="My Posts" onClick={() => this.props.fetchCurUserPosts(this.fetchCriteria)}/>
              </Tabs>
            </Box>
            {console.log(this.state.currentTabIndex)}
            {this.state.currentTabIndex == 0 && this.getSortingBarJoined()}
            {this.state.currentTabIndex == 1 && this.getSortingBarAll()}
            {this.state.currentTabIndex == 2 && this.getSortingBar()}
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

const mapDispatchToProps = (dispatch: AppDispatch, props: ForumMainPageProps) => {
  return {
    fetchJoinedClasses: () => dispatch(fetchJoinedClasses()),
    fetchAllClassesPosts: (fetchCriteria: FetchCriteria) => dispatch(fetchAllClassesPosts(fetchCriteria)),
    fetchJoinedClassesPosts: (fetchCriteria: FetchCriteria) => dispatch(fetchJoinedClassesPosts(fetchCriteria)),
    fetchCurUserPosts: (fetchCriteria: FetchCriteria) => dispatch(fetchCurUserPosts(fetchCriteria)),
  }
}

export default compose<React.ComponentType<ForumMainPageProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
  ])
)(ForumMainPage)