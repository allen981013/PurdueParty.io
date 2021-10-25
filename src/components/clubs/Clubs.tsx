import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addClub } from '../../store/actions/clubActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material'

// Interface/type for Clubs State
interface ClubState {
  imageURL: string
}

// Interface/type for Clubs Props
interface ClubProps {
  club:{
    title: string,
    description: string,
    image: string,
    id: string,
  }[],
  auth: any,
  firebase: any
}

class Clubs extends Component<ClubProps, ClubState> {
  // Initialize state
  constructor(props: ClubProps) {
    super(props);
    this.state = {
      imageURL: ""
    }
  }


  getClub(title:string, description:string, imageURL:string, id:string){
    return(
      <Grid 
          item
          id="image-container"
          xs={12} 
          md={12}
          display="inline-flex"
          list-style="none"
          alignSelf="center"
          flexDirection="row"
          alignItems="center"
      >
        <CardActionArea component={Link} to={"/clubs/" + id} 
        sx={{display:"inline-flex"}}>

          <Card style={{width:"10%"}}>
          <CardMedia
                component="img"
                height="90"
                image={imageURL}
              />
          </Card>
          
          <Card style={{width : "90%" }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
              <Typography
                noWrap
                variant="h6"
                sx={{ fontSize: "18px", paddingBottom: "4px" }}
              >
                  {title}
              </Typography>
              <Typography
                noWrap
                variant="body2"
                sx={{ paddingBottom: "0px" }}
              >
                  {description}
              </Typography>
              </CardContent>
          </Card>

          </CardActionArea>
      </Grid>
  )
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />

    return (
      <div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
              pb="16px"
            >
              <h1 style={{ fontWeight: 300, margin: "0px" }}>Clubs</h1>
              <Button
                component={Link}
                to="/clubs/create-club"
                variant="outlined"
                sx={{ color: "black", border: "1px solid black" }}
              > Create
              </Button>
            </Box>
          </Box></div>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <Box id="cropped-purdue-img" />
                    <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                    {this.props.club != undefined && this.props.club.length != 0 
                    ?
                    this.props.club.map((clubs) => this.getClub(clubs.title, clubs.description,clubs.image, clubs.id))
                    :
                    <div>Club Missing</div>
                    }
                    </Grid>
          </Box>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    club: state.firestore.ordered.clubs,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
  }
}

export default compose<React.ComponentType<ClubProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'clubs' }
  ])
)(Clubs)