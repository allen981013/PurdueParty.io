import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Timestamp} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './MarketPlace.css';
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material'


// Interface/type for Marketplace State
interface MarketPlaceState {
  imageURL:string
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
        imageURL: string
    }[],
    auth: any,
    firebase: any
}

class MarketPlace extends Component<MarketPlaceProps, MarketPlaceState> {

    constructor(props:MarketPlaceProps) {
        super(props);
        this.state = {
          imageURL: ""
        }
    }


    //material-ui use card
    getItemCard(title: string, price: number, id: string) {
        return (
          <Grid item xs={12} sm={6} md={4}>
            <div className="section-card">
              <div className="section-card__stripe" />
              <div className="section-card__body">
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
                  <h3 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "larger" }}>{title} </h3>
                  <h1 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "smaller" }}>Cost: {price} </h1>
                  <a href={"/sellListing/" + id}> View Additional Information </a>
                </div>
              </div>
            </div>
          </Grid>
        )
      }

    async getImageDownload(imageURL:string) {
      try {
        const storageRef = this.props.firebase.storage().ref();
        const res = await Promise.resolve(storageRef.child(imageURL).getDownloadURL());
        this.setState({
          imageURL: res
        })
      } catch (err) {
        console.log(err);
      }
    }

    getCard(title: string, price: number, id: string, imageURL: string) {

      this.getImageDownload(imageURL);

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
              image={this.state.imageURL}
            />
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography gutterBottom noWrap component="div">
                {title}
              </Typography>
              <Typography noWrap variant="body2" color="text.secondary" component="div">
                {"$" + price}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
       </Grid>
      )
    }

    render() {
        const { auth } = this.props;
        //const { sellListings } = this.props.marketplace;
        //console.log(this.props.firebase.storage);
        if (!auth.uid) return <Redirect to= '/signin'/>
        return (
            <div>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
              <Box id="cropped-purdue-img" />
                <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                    { this.props.marketplace != null
                    ?
                    this.props.marketplace.map((sellListing) => this.getCard(sellListing.title, sellListing.price, sellListing.id, sellListing.imageURL))
                    :
                    <div>No SellListings Found</div>
                    }
                </Grid>
              </Box>
              
              <div>
                <Link to="/marketplace/create-listing">
                    <button type="button">
                          Create a listing
                    </button>
                </Link>
              </div>

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
      { collection: 'sellListings'}
    ])
  )(MarketPlace)