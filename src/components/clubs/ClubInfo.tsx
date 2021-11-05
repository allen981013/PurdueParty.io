import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { Redirect, Link } from 'react-router-dom';
import { Box, Button, Grid, Chip, Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { EditOutlined, OutdoorGrillOutlined } from '@mui/icons-material'
import { actionTypes } from 'redux-firestore';
import { Action, compose, Dispatch } from 'redux';
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';
import { Timestamp } from 'firebase/firestore';

interface ClubInfoProps {
  auth?: FirebaseReducer.AuthState;
  clubID: string;
  clubInfo?: {
    catgeory: string[],
    contactInfo: string,
    description: string,
    orgID: string,
    editors: string[],
    owner: string,
    title: string,
    image: string
  }
  users?: {
    userName: string
  }[];
  events?: {
    image: string,
    title: string,
    orgID: string,
    startTime: Timestamp,
    location: string,
    id: string
  }[];
}

interface ClubInfoStates {
};

class ClubInfo extends Component<ClubInfoProps, ClubInfoStates> {

  constructor(props: ClubInfoProps) {
    super(props);
    this.state = {
    };
  }

  isHolder = (user: any) => {
    if (this.props.clubInfo) {
      return user.id === this.props.clubInfo.owner
    } else {
      return false;
    }
  }

  getChips(texts: string[]) {
    return (
      <Box display="flex" alignSelf="flex-start">
        {
          texts.map((text) =>
            <Chip
              label={text}
              variant="outlined"
              sx={{ marginRight: "8px" }}
            />
          )
        }
      </Box>
    )
  }

  getEvents(image: string, title: string, orgID: string, eventID: string, location: string, startTime: Timestamp) {
    return (
      <Box
        display="flex"
        alignSelf="center"
        flexDirection="column"
        alignItems="center"
        pt="8px"
        maxWidth="1200px"
        margin="20px 20px"
      >
        <Grid
          item
          xs={12}
          md={12}
          sx={{ width: "100%" }}
        >
          <Card sx={{ width: "100%", height: 200 }}>
            <CardActionArea
              component={Link}
              to={"/events/" + eventID}
              sx={{ display: "inline-flex", width: "100%", height: "100%" }}
            >
              <Box width="20%" height="100%">
                <CardMedia
                  component="img"
                  height="100%"
                  image={image}
                />
              </Box>
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "80%" }}>
                <label htmlFor="title">Event Name </label>
                <Typography gutterBottom noWrap component="div" marginBottom="10px">
                  {title}
                </Typography>
                <label htmlFor="title">Location: </label>
                <Typography gutterBottom noWrap component="div" marginBottom="10px">
                  {location}
                </Typography>
                <label htmlFor="title">Start Time: </label>
                <Typography gutterBottom noWrap component="div" marginBottom="10px">
                  {startTime.toDate().toLocaleString()}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid >
      </Box>
    )
  }

  getClub(club: ClubInfoProps["clubInfo"], ownerName: string) {
    return (
      <Box
        display="flex"
        alignSelf="center"
        flexDirection="column"
        alignItems="center"
        pt="8px"
        maxWidth="1200px"
        margin="56px 16px"
      >
        <Grid
          container
          id="top-page-container"
          spacing={2}
          sx={{ minWidth: { md: "900px" } }}
        >
          <Grid
            item
            id="image-container"
            xs={12}
            md={6}
          >
            <img width="100%" height="100%" src={club.image} />
          </Grid>

          <Grid
            item
            id="details-container"
            xs={12}
            md={6}
          >
            <Box
              id="title-container"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              pl="16px"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                pb="32px"
              >
                <h1 style={{ fontWeight: 300, margin: "0px" }}>{club.title}</h1>

                {this.props.clubInfo.editors.includes(this.props.auth.uid) && <Button
                  component={Link}
                  to={"/edit-club/" + this.props.clubID}
                  variant="outlined"
                  sx={{ color: "black", height: "32px" }}
                >
                  <EditOutlined sx={{ fontSize: "16px", paddingRight: "4px" }} />
                  {/* Edit Club */}
                </Button>}
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                pb="24px"
              >
                <strong style={{ paddingBottom: "8px" }}>Club Owner</strong>
                <span>{ownerName}</span>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                pb="24px"
              >
                <strong style={{ paddingBottom: "8px" }}>Contact Information</strong>
                <span style={{ paddingBottom: "4px" }}>{club.contactInfo}</span>
              </Box>

            </Box>
          </Grid>
        </Grid>

        <hr style={{ width: "100%", border: "1px solid lightgrey", margin: "40px 0px 28px" }} />
        <h1 style={{ fontWeight: 300, margin: "0px 0px 16px", alignSelf: "flex-start" }}>Description</h1>
        <Box alignSelf="flex-start">{club.description}</Box>

        <h1 style={{ fontWeight: 300, margin: "24px 0px 16px", alignSelf: "flex-start" }}>Catgeory</h1>
        {this.getChips(club.catgeory)}

        <hr style={{ width: "100%", border: "1px solid lightgrey", margin: "40px 0px 28px" }} />
        <h1 style={{ fontWeight: 300, margin: "24px 0px 16px", alignSelf: "flex-start" }}>Relevant Events</h1>

      </Box>
    )
  }

  render() {
    if (!this.props.auth.uid)
      return <Redirect to='/signin' />

    var holdUser: any = undefined;
    if (this.props.users) {
      holdUser = this.props.users.find(this.isHolder);
    }
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {this.props.clubInfo != undefined && holdUser != undefined ?
          <Box>
            {this.getClub(this.props.clubInfo, holdUser.userName)}
            <Box>
              {this.props.events != undefined && this.props.events.length != 0
                ?
                this.props.events.map((event) => this.getEvents(event.image, event.title, event.orgID, event.id, event.location, event.startTime))
                :
                <div>No Relevant Event</div>
              }
            </Box>
          </Box>
          :
          <div></div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  // Map club object to meet the UI's need
  var clubs = state.firestore.ordered.clubInfoClubs
  var clubInfo: ClubInfoProps["clubInfo"] = (clubs !== undefined && clubs.length > 0)
    ? clubs.map((club_: any) => {
      return {
        catgeory: club_.category,
        contactInfo: club_.contactInfo,
        description: club_.description,
        orgID: club_.orgID,
        editors: club_.editors,
        owner: club_.owner,
        title: club_.title,
        image: club_.image
      }
    })[0]
    : undefined

  var events: ClubInfoProps["events"] = state.firestore.ordered.clubInfoEvents
    ? state.firestore.ordered.clubInfoEvents.map((event: any) => {
      return {
        image: event.image,
        title: event.title,
        orgID: event.orgID,
        startTime: event.startTime,
        location: event.location,
        id: event.id
      }
    })
    : undefined

  return {
    auth: state.firebase.auth,
    users: state.firestore.ordered.users,
    events: events,
    clubInfo: clubInfo,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch, props: ClubInfoProps) => {
  return {
    clearFetchedDocs: () => dispatch(
      (reduxDispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        reduxDispatch({
          type: actionTypes.LISTENER_RESPONSE,
          meta: {
            collection: "clubs",
            where: [
              ["orgId", "==", props.clubID],
            ],
            storeAs: "clubInfoClubs",
            limit: 1,
          },
          payload: {}
        })
        reduxDispatch({
          type: actionTypes.LISTENER_RESPONSE,
          meta: {
            collection: "events",
            where: [
              ["orgID", "==", props.clubID],
            ],
            orderBy: [
              ["startTime", "desc"],
            ],
            storeAs: "clubInfoEvents",
          },
          payload: {}
        })
      }
    )
  }
}

export default compose<React.ComponentType<ClubInfoProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: ClubInfoProps) => {
    return [
      {
        collection: "clubs",
        where: [
          ["orgId", "==", props.clubID],
        ],
        storeAs: "clubInfoClubs",
        limit: 1,
      },
      {
        collection: "users"
      },
      {
        collection: "events",
        where: [
          ["orgID", "==", props.clubID],
        ],
        storeAs: "clubInfoEvents",
      }
    ]
  })
)(ClubInfo);