import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { placeDownloadURLS } from '../../store/actions/laundryActions';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material';

interface LaundryLandingState {

}

interface LaundryLandingProps {
  laundry: {
    imageURL: string
  }[],
  auth: any,
  firebase: any,
  placeDownloadURLS: () => void
}

class LaundryLanding extends Component<LaundryLandingProps, LaundryLandingState> {

  readonly laundryLocations = ["Wiley", "Ford", "Hillenbrad", "Earhart", "Windsor"];

  // Note : Uncomment this whenever we want to update the dining court photos.
  // Note : Must have already updated the photos manually in Firebase Storage
  // Note : This only needs to run once. After you re-render, re-comment this out until next update.
  //   componentDidMount() {
  //       this.props.placeDownloadURLS();
  //   }
    

  constructor(props: LaundryLandingProps) {
    super(props);
    this.state = {

    }
  }

  HonorsRender(title: any) {
    if (title.includes("South")) {
      return("Honors South");
    }
    else if (title.includes("North")) {
      return("Honors North");
    }
    else {
      return title;
    }
  }

  getCard(laundry: any) {
    return (
      <Grid
        item
        id="image-container"
        xs={12}
        md={3}
      >
        <Card>
          <CardActionArea component={Link} to={"/laundry/" + laundry.id}>
            <CardMedia
              component="img"
              height="140"
              image={laundry.imageURL}
            />
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography gutterBottom noWrap component="div">
                {this.HonorsRender(laundry.id)}
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
          <h1 style={{ fontWeight: 300, margin: "0px" }}>Laundry Locations</h1>
        </Box>
        <Grid container spacing={2}>
          {this.props.laundry != undefined
            ?
            this.props.laundry.map((laundry) => this.getCard(laundry))
            :
            <div>Retrieving laundry locations, Please Wait...</div>
          }
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    laundry: state.firestore.ordered.laundry
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    placeDownloadURLS: () => dispatch(placeDownloadURLS())
  }
}

export default compose<React.ComponentType<LaundryLandingProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'laundry' }
  ])
)(LaundryLanding)