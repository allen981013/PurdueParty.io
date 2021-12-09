import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './MarketPlace.css';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography, FormControl, RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, InputLabel, Select, MenuItem
} from '@mui/material'
import { toast } from 'react-toastify';
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { MARKETPLACE_TUTORIAL_1, MARKETPLACE_TUTORIAL_2, MARKETPLACE_TUTORIAL_3 } from '../tutorial/Constants'

// Interface/type for Marketplace State
interface MarketPlaceState {
  imageURL: string,
  type: string,
}

// Interface/type for MarketPlace Props
interface MarketPlaceProps {
  marketplace: {
    contactInfo: string,
    description: string,
    id: string,
    image: string,
    owner: string,
    postedDateTime: Timestamp,
    price: number,
    title: string,
    type: string,
  }[],
  auth: any,
  firebase: any
  pageVisitInfo: PageVisitInfo;
  updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => void;
}

class MarketPlace extends Component<MarketPlaceProps, MarketPlaceState> {
  types = ["Artwork", "Clothing", "Electronics", "Furniture", "Gaming", "Housing",
    "Miscellaneous", "Music/Instruments", "Services", "Vehicles"];

  isTutorialRendered = false

  constructor(props: MarketPlaceProps) {
    super(props);
    this.state = {
      imageURL: "",
      type: "None",
    }
  }

  handleChangeType = (e: any) => {
    this.setState({
      type: e.target.value
    })
  }

  getCard(title: string, price: number, type: string, id: string, imageURL: string) {
    console.log(imageURL);
    if (this.state.type == "None" || this.state.type == type) {
      return (
        <Grid
          item
          xs={12}
          md={3}
        >
          <Card>
            <CardActionArea component={Link} to={"/sellListing/" + id}>
              <CardMedia
                component="img"
                height="140"
                image={imageURL}
              />
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography gutterBottom noWrap component="div">
                  {title}
                </Typography>
                <Typography noWrap variant="body2" color="text.secondary" component="div">
                  {"$" + price + "    -   " + type}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      )
    }
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to='/signin' />
    // Render tutorial
    if (this.props.pageVisitInfo
      && !this.props.pageVisitInfo.marketplacePage
      && !this.isTutorialRendered
    ) {
      toast.info(MARKETPLACE_TUTORIAL_1)
      toast.info(MARKETPLACE_TUTORIAL_2)
      toast.info(MARKETPLACE_TUTORIAL_3)
      let newPageVisitInfo: PageVisitInfo = {
        ...this.props.pageVisitInfo,
        marketplacePage: true,
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
        maxWidth="1300px"
        padding="48px 16px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          pb="32px"
        >
          <h1 style={{ fontWeight: 300, margin: "0px" }}>Marketplace</h1>
          <Button
            component={Link}
            to="marketplace/create-listing/"
            variant="outlined"
            sx={{ color: "black", border: "1px solid black", backgroundColor: "white" }}
          > Create
          </Button>
        </Box>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            md={3}
          >
            <Box display="flex" flexDirection="column">
              <Typography
                style={{ alignSelf: "flex-start", padding: "0px 0px 12px" }}
              >
                Filter by type
              </Typography>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.type}
                  label="type"
                  onChange={this.handleChangeType}
                >

                  {this.types.map((types) => {
                    return (
                      <MenuItem value={types}>{types}</MenuItem>
                    )
                  })}
                  <MenuItem value={"None"}>None</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
          >
            <Grid container spacing={2} >
              {this.props.marketplace != undefined && this.props.marketplace.length != 0
                ?
                this.props.marketplace.map((sellListing) => this.getCard(sellListing.title, sellListing.price, sellListing.type, sellListing.id, sellListing.image))
                :
                <div>No SellListings Found</div>
              }
            </Grid>
          </Grid>
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pageVisitInfo: state.tutorial.pageVisitInfo,
    marketplace: state.firestore.ordered.sellListings,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
  }
}

export default compose<React.ComponentType<MarketPlaceProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'sellListings' }
  ])
)(MarketPlace)