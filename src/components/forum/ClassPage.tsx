import React, { Component } from 'react';
import { Action, compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';
import { RootState, AppDispatch } from '../../store';
import { Redirect, Link } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardContent, Typography, ToggleButton, ToggleButtonGroup
} from '@mui/material'
import { styled } from '@mui/material/styles';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import StarRateIcon from '@mui/icons-material/StarRate';
import moment from 'moment';
import { actionTypes } from 'redux-firestore';

interface Post {
  title: string;
  content: string;
  poster: string;
  numComments: number;
  timeSincePosted: string;
  href: string;
  classID: string;
}

interface ClassPageState {
  sortCriteria: string;
}

export interface ClassPageProps {
  auth?: FirebaseReducer.AuthState;
  classID: string;
  isDataFetched?: boolean;
  posts?: Post[];
  classInfo?: {
    title: string
    description: string,
    department: string,
    instructorName: string,
    instructorEmail: string,
    classID: string;
  };
  clearFetchedDocs?: () => void;
}

export const SORT_OPTION = {
  recency: "POSTED_TIME",
  popularity: "POPULARITY",
}

class ClassPage extends Component<ClassPageProps, ClassPageState> {
  // Initialize state
  constructor(props: ClassPageProps) {
    super(props);
    this.state = {
      sortCriteria: SORT_OPTION.recency,
    };
  }

  componentDidMount() {
    const classInfoIsEmptyOrObsolete = () => !this.props.classInfo
      || (this.props.classInfo
        && this.props.classInfo.classID !== this.props.classID)
    const postsIsEmptyOrObsolete = () => !this.props.posts
      || this.props.posts.length == 0
      || (this.props.posts.length > 0 && this.props.posts[0].classID !== this.props.classID)
    if (classInfoIsEmptyOrObsolete() || postsIsEmptyOrObsolete()) {
      this.props.clearFetchedDocs()
    }
  }

  getPost(post: Post) {
    return (
      <Grid
        item
        xs={12}
        md={12}
      >
        <Card sx={{ marginBottom: "16px" }}>
          <CardActionArea disableRipple component={Link} to={post.href}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
            >
              <Box display="flex" flexDirection="row" pb="4px">
                {/* Note: We split the following text into separate tags in case we want to 
                  proceed with the idea of making username & time clickable` */}
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px" }}
                >Posted by&nbsp;
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#787c7e", fontSize: "12px" }}
                >{post.poster}&nbsp;
                </Typography>
                <Typography
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

  getClass(class_: ClassPageProps["classInfo"]) {
    return (
      <Card>
        <Box p="12px 16px" sx={{ background: "#f3f4f6", color: "black" }}>
          Class Info
        </Box>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <label htmlFor="title">Course:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.title}
          </Typography>
          <label htmlFor="title">Department:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.department}
          </Typography>
          <label htmlFor="title">Description:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.description}
          </Typography>
          <label htmlFor="title">Instructor:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.instructorName}
          </Typography>
          <label htmlFor="title">Instructor Email:</label>
          <Typography noWrap variant="body2" component="div">
            {class_.instructorEmail}
          </Typography>
        </CardContent>
      </Card>
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
            value={this.state.sortCriteria}
            exclusive
            onChange={(_, newVal) => { this.setState({ sortCriteria: newVal }) }}
            aria-label="text alignment"
          >
            <ToggleButton value={SORT_OPTION.recency}>
              {/* <StarBorderPurple500Icon sx={{ paddingRight: "4px" }} /> */}
              <StarRateIcon sx={{ paddingRight: "4px" }} />
              New
            </ToggleButton>
            <ToggleButton value={SORT_OPTION.popularity}>
              <WhatshotIcon sx={{ paddingRight: "4px" }} />
              Popular
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Card>
      </Box>
    )
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    if (!this.props.isDataFetched)
      return (
        <Box pt="32px"><CircularProgress /></Box>
      )
    if (this.props.isDataFetched && this.props.classInfo === undefined)
      return (
        <Box pt="32px">Class not found</Box>
      )

    return (
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        maxWidth="1200px"
        alignSelf="center"
        p="2rem"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <h1 style={{ fontWeight: 300 }}>
            {this.props.classID}
          </h1>
          <Button
            component={Link}
            to={"/create-post/" + this.props.classID}
            variant="outlined"
            sx={{ color: "black", border: "1px solid black", height: "38px" }}
          > New Post
          </Button>
        </Box>
        <Grid
          container
          spacing={3}
        >
          <Grid item xs={12} md={9} >
            {this.getSortingBar()}
            {this.props.posts === undefined
              && <CircularProgress />
            }
            {this.props.posts != undefined
              && this.props.posts.length != 0
              && this.props.posts.map((post) => this.getPost(post))
            }
            {this.props.posts != undefined
              && this.props.posts.length == 0
              && <Box pt="32px">There are no posts yet in this class</Box>
            }
          </Grid>
          <Grid item xs={12} md={3}>
            {this.props.classInfo === undefined
              && <div>Class was not found</div>
            }
            {
              this.props.classInfo !== undefined
              && this.getClass(this.props.classInfo)
            }
          </Grid>
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  // Map posts objects to meet the UI's needs
  var posts: ClassPageProps["posts"] = state.firestore.ordered.classPagePosts
    ? state.firestore.ordered.classPagePosts.map((post: any) => {
      return {
        title: post.title,
        content: post.content,
        poster: "raziqraif",    // TODO: Our post object only contains poster ID for now, and not 
        // username. While we can do some hacks here to get username from ID, I'm 
        // just gonna wait until we've denormalized our DB.
        numComments: post.numComments,
        href: "/classes/" + post.classID + "/" + post.postId,
        timeSincePosted: moment(post.postedDateTime.toDate()).fromNow(),
        classID: post.classID,
      }
    })
    : undefined
  // Map class object to meet the UI's need
  var classes = state.firestore.ordered.classPageClasses
  var classInfo: ClassPageProps["classInfo"] = (classes !== undefined && classes.length > 0)
    ? classes.map((class_: any) => {
      return {
        title: class_.title,
        description: class_.description,
        department: class_.department,
        instructorName: class_.instructorName,
        instructorEmail: class_.profEmail,
        classID: class_.classID,
      }
    })[0]
    : undefined
  // Return mapped redux states  
  return {
    auth: state.firebase.auth,
    posts: posts,
    classInfo: classInfo,
    isDataFetched: posts !== undefined && classes !== undefined,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch, props: ClassPageProps) => {
  return {
    clearFetchedDocs: () => dispatch(
      (reduxDispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        reduxDispatch({
          type: actionTypes.LISTENER_RESPONSE,
          meta: {
            collection: 'posts',
            where: [
              ["classID", "==", props.classID]
            ],
            orderBy: [
              ["postedDateTime", "desc"],
            ],
            storeAs: "classPagePosts"
          },
          payload: {}
        })
        reduxDispatch({
          type: actionTypes.LISTENER_RESPONSE,
          meta: {
            collection: "classes",
            where: [
              ["courseID", "==", props.classID],
            ],
            storeAs: "classPageClasses",
            limit: 1,
          },
          payload: {}
        })
      }
    )
  }
}

export default compose<React.ComponentType<ClassPageProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: ClassPageProps) => {
    return [
      {
        collection: 'posts',
        where: [
          ["classID", "==", props.classID],
          ["ancestorsIDs", "==", []]
        ],
        orderBy: [
          ["postedDateTime", "desc"],
        ],
        storeAs: "classPagePosts"
      },
      {
        collection: "classes",
        where: [
          ["courseID", "==", props.classID],
        ],
        storeAs: "classPageClasses",
        limit: 1,
      }
    ]
  })
)(ClassPage)