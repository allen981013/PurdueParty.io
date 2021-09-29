import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Timestamp} from 'firebase/firestore';
import { IconButton, Grid, Box } from '@mui/material';
import { ArrowForwardOutlined } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import './MarketPlace.css';


// Interface/type for Marketplace State
interface MarketPlaceState {

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
        type: string
    }[],
    auth: any
}

class MarketPlace extends Component<MarketPlaceProps, MarketPlaceState> {

    constructor(props:MarketPlaceProps) {
        super(props);
        this.state = {
            title: "",
            price: 0,
            seller: ""
        }
    }

    getItemCard(title: string, price: number, seller: string) {
        return (
          <Grid item xs={12} sm={6} md={4}>
            <div className="section-card">
              <div className="section-card__stripe" />
              <div className="section-card__body">
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
                  <h3 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "larger" }}>{title} </h3>
                  <h1 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "smaller" }}>Cost: {price} </h1>
                  <h1 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "smaller" }}>Sold By: {seller} </h1>
                </div>
              </div>
            </div>
          </Grid>
        )
      }

    render() {
        const { auth } = this.props;
        //const { sellListings } = this.props.marketplace;
        //console.log(this.props.marketplace);
        if (!auth.uid) return <Redirect to= '/signin'/>

        var renderedListings:any[] = [];

        if (this.props.marketplace !== undefined) {
            renderedListings = this.props.marketplace;
        }

        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Box id="cropped-purdue-img" />
            <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                { this.props.marketplace != null
                    ?
                    this.props.marketplace.map((sellListing) => this.getItemCard(sellListing.title, sellListing.price, sellListing.owner))
                    :
                    console.log('rendering')
                }
            </Grid>
            </Box>
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