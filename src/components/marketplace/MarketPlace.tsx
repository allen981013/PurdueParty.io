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
}

class MarketPlace extends Component<MarketPlaceProps, MarketPlaceState> {
  types = ["Artwork", "Clothing", "Electronics", "Furniture", "Gaming", "Housing",
    "Miscellaneous", "Music/Instruments", "Services", "Vehicles"];

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

    //this.getImageDownload(imageURL);
    console.log(imageURL);
    if (this.state.type == "None" || this.state.type == type) {
      return (
        <Grid
          item
          id="image-container"
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
    //console.log(this.props.marketplace);
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
              <h1 style={{ fontWeight: 300, margin: "0px" }}>MarketPlace</h1>
              <Button
                component={Link}
                to="marketplace/create-listing/"
                variant="outlined"
                sx={{ color: "black", border: "1px solid black" }}
              > Create
              </Button>
            </Box>
          </Box></div>

        <Grid
          container
          spacing={3}
          sx={{ maxWidth: "100%" }}
        >
          <Grid
            item
            xs={12}
            md={3}
          >
            <Box display="flex" flexDirection="column" maxWidth="100%">
              <Typography style={{ color: "#00000099", alignSelf: "flex-start", padding: "0px 120px 12px" }}>Filter by type</Typography>
              <FormControl sx={{ m: 1, width: 300 }}>
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


          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Box id="cropped-purdue-img" />
            <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
              {this.props.marketplace != undefined && this.props.marketplace.length != 0
                ?
                this.props.marketplace.map((sellListing) => this.getCard(sellListing.title, sellListing.price, sellListing.type, sellListing.id, sellListing.image))
                :
                <div>No SellListings Found</div>
              }
            </Grid>
          </Box>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    marketplace: state.firestore.ordered.sellListings,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {

  }
}

export default compose<React.ComponentType<MarketPlaceProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'sellListings' }
  ])
)(MarketPlace)