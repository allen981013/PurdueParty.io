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
import { classPageSlice, fetchClassPosts, FetchCriteria } from '../../components/forum/ClassPageSlice';
import { actionTypes } from 'redux-firestore';
import { joinClass, updateUserClass } from '../../store/actions/postActions';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { toast } from 'react-toastify';
import { CLASS_TUTORIAL_1, CLASS_TUTORIAL_2, CLASS_TUTORIAL_3} from '../tutorial/Constants'

export interface Post {
  title: string;
  content: string;
  poster: string;
  numComments: number;
  numUpvotes: number;
  timeSincePosted: string;
  href: string;
  classID: string;
}

interface ClassPageState {
  sortBy: FetchCriteria["sortBy"];
  students: string[];
  ID: string;
  classJoin: string[];
  currID: string;
}

export interface ClassPageProps {
  auth?: FirebaseReducer.AuthState;
  classID: string;
  isDataFetched?: boolean;
  posts?: Post[];
  users?: {
    userName: string,
    id: string,
    classJoin: string[]
  }[];
  classInfo?: {
    title: string,
    description: string,
    department: string,
    instructorName: string,
    instructorEmail: string,
    classID: string,
    ID: string,
    students: string[];
  };
  pageVisitInfo?: PageVisitInfo;
  updatePageVisitInfo?: (newPageVisitInfo: PageVisitInfo) => void;
  fetchClassPosts?: (classID: string, fetchCriteria: FetchCriteria) => void;
  clearFetchedDocs?: () => void;
  joinClass?: (state: ClassPageState) => void;
  updateUserClass?: (state: ClassPageState) => void;
}

export function getPostCardComponent(post: Post) {
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
                variant="subtitle2"
                sx={{ color: "#787c7e", fontSize: "12px" }}
              >Posted by&nbsp;
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
              <Button
                onClick={e => { e.stopPropagation(); e.preventDefault() }}
                sx={{ textTransform: "none", color: "#787c7e", fontWeight: "bold", fontSize: "12px" }}
              >
                <ArrowUpwardIcon
                  sx={{ color: "#787c7e", marginRight: "4px", fontSize: "20px" }}
                />
                {post.numUpvotes} upvotes
              </Button>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid >
  )
}

class ClassPage extends Component<ClassPageProps, ClassPageState> {

  // Instance attributes
  fetchCriteria: FetchCriteria = { sortBy: "RECENCY" }
  isTutorialRendered = false

  // Initialize state
  constructor(props: ClassPageProps) {
    super(props);
    this.state = {
      sortBy: "RECENCY",
      students: [],
      ID: "",
      classJoin: [],
      currID: ""
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
    this.props.fetchClassPosts(this.props.classID, this.fetchCriteria)
  }

  handleJoin = (event: any) => {
    var action = false;
    var list = new Array();
    var joinList = new Array();
    var userList = this.props.users
    for (var index in userList) {
      if (userList[index].id == this.props.auth.uid) {
        if (userList[index].classJoin != undefined && userList[index].classJoin.length != 0)
          joinList = userList[index].classJoin.slice()
      }
    }

    if (joinList != undefined && joinList.length != 0) {
      if (joinList.includes(this.props.classInfo.classID)) {
        joinList.forEach((element, index) => {
          if (element == this.props.classInfo.classID) joinList.splice(index, 1)
        });
      }
      else {
        joinList.push(this.props.classInfo.classID)
      }
    }
    else {
      joinList.push(this.props.classInfo.classID)
    }

    if (this.props.classInfo.students != undefined && this.props.classInfo.students.length != 0) {
      if (this.props.classInfo.students.includes(this.props.auth.uid)) {
        list = list.concat(this.props.classInfo.students)
        list.forEach((element, index) => {
          if (element == this.props.auth.uid) list.splice(index, 1)
        });
        action = false
      }
      else {
        if (this.props.classInfo.students == undefined) {
          list.push(this.props.auth.uid)
        }
        else {
          list = list.concat(this.props.classInfo.students)
          list.push(this.props.auth.uid)
        }
        action = true
      }
    }
    else {
      if (this.props.classInfo.students == undefined) {
        list.push(this.props.auth.uid)
      }
      else {
        list = list.concat(this.props.classInfo.students)
        list.push(this.props.auth.uid)
      }
      action = true
    }

    this.setState({
      students: list,
      ID: this.props.classInfo.ID,
      classJoin: joinList,
      currID: this.props.auth.uid
    }, () => {
      this.props.joinClass(this.state)
      this.props.updateUserClass(this.state)
    })

    if (action) {
      window.alert("Join Class Successfully.")
    }
    else {
      window.alert("Leave Class Successfully.")
    }

  }

  getPost(post: Post) {
    return getPostCardComponent(post)
  }

  getClass(class_: ClassPageProps["classInfo"]) {
    return (
      <Box display="flex" flexDirection={"column"}>
        <Card>
          <Box p="12px 16px" sx={{ background: "#f3f4f6", color: "black" }}>
            Class Info
          </Box>
          <CardContent sx={{ textAlign: "left" }}>
            <label htmlFor="title">Course:</label>
            <Typography noWrap variant="body2" component="div" marginBottom="8px">
              {class_.title}
            </Typography>
            <label htmlFor="title">Department:</label>
            <Typography noWrap variant="body2" component="div" marginBottom="8px">
              {class_.department}
            </Typography>
            {/* <label htmlFor="title">Description:</label>
          <Typography noWrap variant="body2" component="div" marginBottom="8px">
            {class_.description}
          </Typography> */}
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
        <Card sx={{ marginTop: "16px" }}>
          <Box p="12px 16px" sx={{ background: "#f3f4f6", color: "black" }}>
            Student
          </Box>
          <CardContent>
            {class_.students != undefined && class_.students.length != 0
              ?
              this.getStudents(class_.students)
              :
              <div> There is no student yet.</div>
            }
          </CardContent>
        </Card>
        <Button
          onClick={this.handleJoin}
          sx={{
            color: "black", border: "1px solid black", height: "38px", width: "100%",
            marginTop: "16px", alignSelf: 'flex-end'
          }}
        >
          {this.props.classInfo.students != undefined && this.props.classInfo.students.length != 0
            ?
            (this.props.classInfo.students.includes(this.props.auth.uid)
              ?
              "Leave class"
              :
              "Join class"
            )
            :
            "Join This Class"
          }
        </Button>
      </Box >
    )
  }


  getStudents(students: string[]) {
    var nameList = new Array()
    var usersList = this.props.users

    if (students.length != 0 && usersList.length != 0) {
      for (var index1 in usersList) {
        for (var index2 in students) {
          if (usersList[index1].id == students[index2]) {
            nameList.push(usersList[index1].userName)
          }
        }
      }
    }

    return (

      <CardContent sx={{ textAlign: "left" }}>
        {
          nameList.map((student) =>
            <Card sx={{ width: "100%", height: 40, marginBottom: "10px" }}>
              <CardActionArea
                component={Link}
                to={"/users/" + student}
                sx={{ display: "inline-flex", width: "100%", height: "100%" }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                  <Typography gutterBottom noWrap component="div">
                    {student}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        }
      </CardContent>

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
              this.props.fetchClassPosts(this.props.classID, this.fetchCriteria)
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
              <WhatshotIcon sx={{ paddingRight: "4px" }} />
              HOT
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Card>
      </Box >
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
    if (this.props.pageVisitInfo 
      && !this.props.pageVisitInfo.classPage
      && !this.isTutorialRendered
      ) {
      toast.info(CLASS_TUTORIAL_1)
      toast.info(CLASS_TUTORIAL_2)
      toast.info(CLASS_TUTORIAL_3)
      let newPageVisitInfo: PageVisitInfo = {
        ...this.props.pageVisitInfo,
        classPage: true,
      }
      this.props.updatePageVisitInfo(newPageVisitInfo)
      this.isTutorialRendered = true
    }
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
            {this.props.posts === undefined
              && <CircularProgress />
            }
            {this.props.posts != undefined
              && this.props.posts.length == 0
              && <Box pt="32px">There are no posts yet in this class</Box>
            }
            {this.props.posts != undefined
              && this.props.posts.length != 0
              && this.getSortingBar()
            }
            {this.props.posts != undefined
              && this.props.posts.length != 0
              && this.props.posts.map((post) => this.getPost(post))
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
        classID: class_.courseID,
        ID: class_.ID,
        students: class_.students
      }
    })[0]
    : undefined

  // Return mapped redux states  
  return {
    auth: state.firebase.auth,
    posts: state.classPage.posts,
    users: state.firestore.ordered.users,
    classInfo: classInfo,
    pageVisitInfo: state.tutorial.pageVisitInfo,
    isDataFetched: state.classPage.posts !== undefined && classes !== undefined,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch, props: ClassPageProps) => {

  return {
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
    joinClass: (classInfo: any) => dispatch(joinClass(classInfo)),
    updateUserClass: (classInfo: any) => dispatch(updateUserClass(classInfo)),
    fetchClassPosts: (classID: string, fetchCriteria: FetchCriteria) => dispatch(
      fetchClassPosts(classID, fetchCriteria)
    ),
    clearFetchedDocs: () => dispatch(
      (reduxDispatch: Dispatch<Action>,
        getState: any,
        { getFirebase, getFirestore }: any
      ) => {
        reduxDispatch(classPageSlice.actions.fetchClassPostsBegin())
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
        collection: "classes",
        where: [
          ["courseID", "==", props.classID],
        ],
        storeAs: "classPageClasses",
        limit: 1,
      },
      { collection: 'users' },
    ]
  })
)(ClassPage)