import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { placeDownloadURLS } from '../../store/actions/diningActions';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material';
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { toast } from 'react-toastify';
import { DININGS_TUTORIAL_1, DININGS_TUTORIAL_2, DININGS_TUTORIAL_3} from '../tutorial/Constants'

interface DiningLandingState {
}

interface DiningLandingProps {
  diningCourts: {
    imageURL: string
  }[],
  auth: any,
  firebase: any,
  pageVisitInfo: PageVisitInfo;
  updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => void;
  placeDownloadURLS: () => void
}

class DiningLanding extends Component<DiningLandingProps, DiningLandingState> {

  readonly diningCourts = ["Wiley", "Ford", "Hillenbrad", "Earhart", "Windsor"];
  isTutorialRendered = false;

  constructor(props: DiningLandingProps) {
    super(props);
    this.state = {

    }
  }

  getCard(diningCourt: any) {
    return (
      <Grid
        item
        id="image-container"
        xs={12}
        md={3}
      >
        <Card>
          <CardActionArea component={Link} to={"/dining/" + diningCourt.id}>
            <CardMedia
              component="img"
              height="140"
              image={diningCourt.imageURL}
            />
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography gutterBottom noWrap component="div">
                {diningCourt.id}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    )
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    /* 
    Convert this to 2 vertical cols 
    FOLLOW UP COMMENT: If this is still needed, change the 'md' props value in getCard to 6 - Raziq
    */
    if (this.props.pageVisitInfo 
      && !this.props.pageVisitInfo.diningsPage
      && !this.isTutorialRendered
      ) {
      toast.info(DININGS_TUTORIAL_1)
      toast.info(DININGS_TUTORIAL_2)
      toast.info(DININGS_TUTORIAL_3)
      let newPageVisitInfo: PageVisitInfo = {
        ...this.props.pageVisitInfo,
        diningsPage: true,
      }
      this.props.updatePageVisitInfo(newPageVisitInfo)
      this.isTutorialRendered = true
    }
    return (
      <Box
        display="flex"
        alignSelf="center"
        flexDirection="column"
        alignItems="center"
        pt="8px"
        width="100%"
        maxWidth="1200px"
        padding="48px 16px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          pb="32px"
        >
          <h1 style={{ fontWeight: 300, margin: "0px" }}>Dining Courts</h1>
        </Box>
        <Grid container spacing={2}>
          {this.props.diningCourts != undefined
            ?
            this.props.diningCourts.map((diningCourt) => this.getCard(diningCourt))
            :
            <div>Retrieving Dining Courts, Please Wait...</div>
          }
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    diningCourts: state.firestore.ordered.diningCourts,
    pageVisitInfo: state.tutorial.pageVisitInfo,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
    placeDownloadURLS: () => dispatch(placeDownloadURLS())
  }
}

export default compose<React.ComponentType<DiningLandingProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'diningCourts' }
  ])
)(DiningLanding)