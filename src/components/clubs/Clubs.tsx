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
  CardMedia, CardContent, Typography, Paper, IconButton, InputBase
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { ClubsFetchParameter } from './ClubsPageSlice';
import { fetchClubs } from './ClubsPageSlice';

// Interface/type for Clubs State
interface ClubsState {
}

// Interface/type for Clubs Props
export interface ClubsProps {
  clubs: {
    title: string,
    description: string,
    image: string,
    id: string,
  }[];
  auth: any;
  firebase: any;
  fetchClubs: (fetchParameter: ClubsFetchParameter) => void;
}

class Clubs extends Component<ClubsProps, ClubsState> {

  // Instance attributes
  fetchParameter: ClubsFetchParameter = {
    searchKeyword: "",
  }

  // Initialize state
  constructor(props: ClubsProps) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.props.fetchClubs(this.fetchParameter)
  }

  handleSearchBarChange = (e: any) => {
    this.fetchParameter.searchKeyword = e.target.value
  }

  handleSearchBarKeyDown = (e: any) => {
    if (e.key === "Enter") {
      this.props.fetchClubs(this.fetchParameter)
    }
  }

  handleSearchButtonClick = (e: any) => {
    this.props.fetchClubs(this.fetchParameter)
  }

  getClub(title: string, description: string, imageURL: string, id: string) {
    return (
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
          sx={{ display: "inline-flex" }}>

          <Card style={{ width: "20%" }}>
            <CardMedia
              component="img"
              height="140"
              image={imageURL}
            />
          </Card>

          <Card style={{ width: "80%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <label htmlFor="title">Club Name: </label>
              <Typography gutterBottom noWrap component="div" marginBottom="10px">
                {title}
              </Typography>
              <label htmlFor="title">Description: </label>
              <Typography gutterBottom noWrap component="div" marginBottom="10px">
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

        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
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
          <Paper
            sx={{ p: '2px 4px 0px 0px ', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Search clubs"
              onChange={this.handleSearchBarChange}
              onKeyDown={this.handleSearchBarKeyDown}
            />
            <IconButton sx={{ p: '10px' }} aria-label="search" onClick={this.handleSearchButtonClick}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
            {this.props.clubs != undefined && this.props.clubs.length != 0
              ?
              this.props.clubs.map((clubs) => this.getClub(clubs.title, clubs.description, clubs.image, clubs.id))
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
    clubs: state.clubsPage.clubs,
    auth: state.firebase.auth,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    fetchClubs: (fetchParameter: ClubsFetchParameter) => dispatch(fetchClubs(fetchParameter)),
    updateFetchParameter: (fetchParameter: any) => dispatch(
      (reduxDispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any
      ) => {
        reduxDispatch({ type: "CLUBS_FETCH_PARAM_UPDATED", payload: fetchParameter })
      })
  }
}

export default compose<React.ComponentType<ClubsProps>>(
  connect(mapStateToProps, mapDispatchToProps)
)(Clubs)