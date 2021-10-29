import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { Redirect, Link} from 'react-router-dom';
import {Box, Button, Grid, Chip} from '@mui/material';
import { EditOutlined} from '@mui/icons-material'
import { actionTypes } from 'redux-firestore';
import { Action, compose, Dispatch } from 'redux';
import { FirebaseReducer, firestoreConnect } from 'react-redux-firebase';

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
    title: string
  };
}

interface ClubInfoStates {
};

class ClubInfo extends Component<ClubInfoProps, ClubInfoStates> {

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

  getClub(club: ClubInfoProps["clubInfo"], hasPermission: boolean, clubID: string, ownerName: string){
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
                <h1 style={{ fontWeight: 300, margin: "0px" }}>{club.title}</h1>
                
                {this.props.clubInfo.editors.includes(this.props.auth.uid) && <Button
                  component={Link}
                  to={"/edit-club/" + this.props.clubID}
                  variant="outlined"
                  sx={{ color: "black", height: "32px" }}
                >
                  <EditOutlined sx={{ fontSize: "16px", paddingRight: "4px" }} />
                  Edit Club
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

      </Box>
    )
  }

  render(){
    if (!this.props.auth.uid) 
      return <Redirect to='/signin' />

    console.log(this.props.clubID)
    console.log(this.props.clubInfo)

    return(
      <div>
      {this.props.clubInfo != undefined ? 
        <Box>{this.getClub(this.props.clubInfo,true,"clubID","OwnerName")}</Box>
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
      title: club_.title
    }
  })[0]
  : undefined

  return {
    auth: state.firebase.auth,
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
    }
    ]
  })
)(ClubInfo);