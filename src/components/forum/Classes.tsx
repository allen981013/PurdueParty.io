import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material'
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { toast } from 'react-toastify';
import { CLASSES_TUTORIAL_1, CLASSES_TUTORIAL_2, CLASSES_TUTORIAL_3} from '../tutorial/Constants'

// Interface/type for Classes State
interface ClassesState {
}

// Interface/type for Clubs Props
interface ClassesProps {
  class?: {
    title: string,
    courseID: string
  }[],
  auth?: any,
  firebase?: any,
  pageVisitInfo?: PageVisitInfo;
  updatePageVisitInfo?: (newPageVisitInfo: PageVisitInfo) => void;
}

class Classes extends Component<ClassesProps, ClassesState> {
  
  isTutorialRendered = false
 
  // Initialize state
  constructor(props: ClassesProps) {
    super(props);
    this.state = {
    }
  }

  getClass(title: string, courseID: string) {

    return (
      <Grid
        item
        id="image-container"
        xs={12}
        md={12}
      >
        <Card>
          <CardActionArea component={Link} to={"/forum/" + courseID}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <label htmlFor="title"> {courseID} </label>
              <Typography noWrap variant="body2" color="text.secondary" component="div" marginBottom="10px">
                {title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    )
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    if (this.props.pageVisitInfo 
      && !this.props.pageVisitInfo.classesPage
      && !this.isTutorialRendered
      ) {
      toast.info(CLASSES_TUTORIAL_1)
      toast.info(CLASSES_TUTORIAL_2)
      toast.info(CLASSES_TUTORIAL_3)
      let newPageVisitInfo: PageVisitInfo = {
        ...this.props.pageVisitInfo,
        classesPage: true,
      }
      this.props.updatePageVisitInfo(newPageVisitInfo)
      this.isTutorialRendered = true
    }
    return (
      <Box
        pt="48px"
        width="1200px"
        alignSelf="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
      >
        <Box display="flex" justifyContent="space-between" width="100%">
          <h1 style={{ fontWeight: 300, margin: "0px" }}>Class List</h1>
          <Button
            component={Link}
            to="/create-class"
            variant="outlined"
            sx={{ color: "black", border: "1px solid black", alignSelf: "flex-end" }}
          > Create
          </Button>
        </Box>
        <Grid container spacing={2} sx={{ paddingTop: "32px" }}>
          {this.props.class != undefined && this.props.class.length != 0
            ?
            this.props.class.map((classes) => this.getClass(classes.title, classes.courseID))
            :
            <div>Classes Missing</div>
          }
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    class: state.firestore.ordered.classes,
    auth: state.firebase.auth,
    pageVisitInfo: state.tutorial.pageVisitInfo,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
  }
}

export default compose<React.ComponentType<ClassesProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'classes' }
  ])
)(Classes)