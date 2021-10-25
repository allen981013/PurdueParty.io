import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {Box, Button, Grid, Chip} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@mui/icons-material'
import { actionTypes } from 'redux-firestore';
import { Action, compose, Dispatch } from 'redux';
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';

interface ClubInfoProps {
  clubID: string,
  clubInfo: {
    catgeory: string[],
    contactInfo: string,
    description: string,
    orgID: string,
    owner: string,
    title: string
  },
  auth?: any,
}

interface ClubInfoStates {
};

class ClubInfo extends React.Component<ClubInfoProps, ClubInfoStates> {

  constructor(props: ClubInfoProps) {
    super(props);
    this.state = {
    }
  }

  getChips(texts: string[]) {
    return (
      <Box display="flex" alignSelf="flex-start">
        {
          texts.map((text) =>
            <Chip
              label={text}
              // color="primary"
              variant="outlined"
              sx={{ marginRight: "8px" }}
            />
          )
        }
      </Box>
    )
  }

  getClub(club_: ClubInfoProps["clubInfo"], hasPermission: boolean, clubID: string, ownerName: string){
    return(
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
                <h1 style={{ fontWeight: 300, margin: "0px" }}>{club_.title}</h1>
                
                <Button
                  component={Link}
                  to={"/edit-club/" + clubID}
                  variant="outlined"
                  sx={{ color: "black", height: "32px" }}
                >
                  <EditOutlined sx={{ fontSize: "16px", paddingRight: "4px" }} />
                  Edit Club
                </Button>
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
                <span style={{ paddingBottom: "4px" }}>{club_.contactInfo}</span>
              </Box>

            </Box>           
          </Grid>
        </Grid>

        <hr style={{ width: "100%", border: "1px solid lightgrey", margin: "40px 0px 28px" }} />
        <h1 style={{ fontWeight: 300, margin: "0px 0px 16px", alignSelf: "flex-start" }}>Description</h1>
        <Box alignSelf="flex-start">{club_.description}</Box>

        <h1 style={{ fontWeight: 300, margin: "24px 0px 16px", alignSelf: "flex-start" }}>Catgeory</h1>
        {this.getChips(club_.catgeory)}

      </Box>
    )
  }

  render(){

    const { auth } = this.props;

    if (!auth.uid) return <Redirect to='/signin'/>

    return(
      <Box>{this.getClub(this.props.clubInfo,true,"clubID","OwnerName")}</Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  var clubs = state.firestore.ordered.ClubPageClubs
  var clubInfo: ClubInfoProps["clubInfo"] = (clubs !== undefined && clubs.length > 0)
  ? clubs.map((club_: any) => {
    return {
      title: club_.title,
      description: club_.description,
      catgeory: club_.catgeory,
      orgID: club_.orgID,
      owner: club_.owner,
      contactInfo: club_.contactInfo,
    }
  })[0]
  : undefined
    return {
      auth: state.firebase.auth,
      clubInfo: clubInfo
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
              ["orgID", "==", props.clubID],
            ],
            storeAs: "ClubPageClubs",
            limit: 1,
          },
          payload: {}
        })
      }
    )
  }
}
  
export default compose<React.ComponentType<ClubInfo>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: ClubInfoProps) => {
    return [
    { collection: "clubs",
    where: [
      ["orgID", "==", props.clubID],
    ],
    storeAs: "ClubPageClubs",
    limit: 1,
    }
  ]
  })
)(ClubInfo);