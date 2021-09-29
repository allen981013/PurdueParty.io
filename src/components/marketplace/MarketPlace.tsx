import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Timestamp} from 'firebase/firestore';
import Modal from 'react-modal';
import { IconButton, Grid, Box } from '@mui/material';
import { ArrowForwardOutlined } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import './MarketPlace.css';
import { useState } from 'react';
import ReactModal from 'react-modal';


// Interface/type for Marketplace State
interface MarketPlaceState {
  showPopup: boolean,
  sellListings: {
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
            showPopup: false,
            sellListings: []
        }

        this.handleOpenPopup = this.handleOpenPopup.bind(this);
        this.handleClosePopup = this.handleClosePopup.bind(this);
    }

    handleOpenPopup () {
      this.setState({ showPopup: true });
    }
    
    handleClosePopup () {
      this.setState({ showPopup: false });
    }
    

    //material-ui use card
    getItemCard(title: string, price: number, seller: string, contactInfo: string, description: string, id: string, image: string, postedDateTime: Timestamp, type: string) {
        return (
          <Grid item xs={12} sm={6} md={4}>
            <div className="section-card">
              <div className="section-card__stripe" />
              <div className="section-card__body">
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
                  <h3 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "larger" }}>{title} </h3>
                  <h1 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "smaller" }}>Cost: {price} </h1>
                  <h1 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "smaller" }}>Sold By: {seller} </h1>
                  <a href={"/" + seller}> CLICK HERE TO VIEW! </a>
                </div>
                <button onClick={this.handleOpenPopup}>View Additional Info</button>
                <ReactModal 
                  isOpen={this.state.showPopup}
                  contentLabel="Additional Listing Information"
                  onRequestClose={this.handleClosePopup}
                  className="Modal"
                  overlayClassName="Overlay"
                >
                  <h5 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "larger" }}>{title} </h5>
                  <h1 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "smaller" }}>Cost: {price} </h1>
                  <h1 style={{ fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "smaller" }}>Sold By: {id} </h1>
                <button className="btn-bot" onClick={this.handleClosePopup}>Close</button>
                </ReactModal>
              </div>
            </div>
          </Grid>
        )
      }

    render() {
        const { auth } = this.props;
        //const { sellListings } = this.props.marketplace;
        console.log(this.props.marketplace);
        if (!auth.uid) return <Redirect to= '/signin'/>

        if (this.props.marketplace !== this.state.sellListings) {
          this.setState({
            sellListings: this.props.marketplace
          });
          console.log(this.state);
        }

        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Box id="cropped-purdue-img" />
            <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                { this.state.sellListings != null
                ?
                this.state.sellListings.map((sellListing) => this.getItemCard(sellListing.title,
                                                                            sellListing.price, 
                                                                            sellListing.owner,
                                                                            sellListing.contactInfo,
                                                                            sellListing.description,
                                                                            sellListing.id,
                                                                            sellListing.image,
                                                                            sellListing.postedDateTime,
                                                                            sellListing.type))
                :
                <div></div>
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