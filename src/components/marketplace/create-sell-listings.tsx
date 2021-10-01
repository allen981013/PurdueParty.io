import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addSellListing } from '../../store/actions/sellListingActions';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom'
import { Timestamp } from '@firebase/firestore';
import { IconButton, Grid, Box } from '@mui/material';
import ReactModal from 'react-modal';

// Interface/type for sellListing State
interface sellListingState {
    id: string,
    owner: string,
    title: string
    description: string,
    postedDateTime: Timestamp,
    type: string,
    image: string,
    price: number,
    contactInfo: string,
    validationMsg: string,
    showPopup: boolean
}

// Interface/type for sellListing Props
interface sellListingProps {
    auth: any,
    sellListings: any,
    addSellListing: (state:sellListingState) => void
}

class createSellListings extends Component<sellListingProps, sellListingState> {

  // Initialize state
  constructor(props:sellListingProps) {
    super(props);
    this.state = {
      id: "",
      owner: "",
      title: "",
      description: "",
      postedDateTime: new Timestamp(0,0),
      type: "",
      image: "",
      price: 0,
      contactInfo: "",
      validationMsg: "",
      showPopup: false
    };

    this.handleOpenPopup = this.handleOpenPopup.bind(this);
    this.handleClosePopup = this.handleClosePopup.bind(this);
  }

    handleOpenPopup () {
        this.setState({ showPopup: true });
    }
    
    handleClosePopup () {
        this.setState({ showPopup: false });
    }

  // General purpose state updater during form modification
  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title : e.target.value
    })
  }

  // General purpose state updater during form modification
  handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description : e.target.value
    })
  }

  // General purpose state updater during form modification
  handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      type : e.target.value
    })
  }

  // General purpose state updater during form modification
  handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("I AM CHANGING PRICE");
    console.log(typeof(e.target.value))

    this.setState({
      price : parseFloat(parseFloat(e.target.value).toFixed(2))
    })
  }

  // General purpose state updater during form modification
  handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      contactInfo : e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event:any) => {
    event.preventDefault();

    if (this.state.title.length < 3) { 
        // Pop modal for title length error
        console.log("Minimum title length required: 3 characters");
        window.alert("Minimum title length required: 3 characters")
    }
    else if (this.state.description.length < 10) {
        // Pop modal for description length error
        console.log("Minimum description Length Required: 10 characters");
        window.alert("Minimum description length required: 10 characters")
    }
    else if (this.state.type === "") {
        // Pop modal for no type error
        console.log("Please select type from dropdown");
        window.alert("Please select type from dropdown")
    }
    else if (isNaN(this.state.price)) { //
        // Pop modal for no price error
        console.log("Please enter a price");
        window.alert("Please enter a price");
    }
    else if (!this.state.contactInfo.includes("@purdue.edu") || this.state.contactInfo.split("@purdue.edu")[0].length < 1) {
        // Pop modal for if the contact info isn't a purdue email or if there's nothing before the @purdue.edu
        console.log("Please enter a valid purdue email. TEMPORARY");
        window.alert("Please enter a valid purdue email. TEMPORARY");
    }
    else {
        // NOTE: Possibly just make price field a string and then
        //       use the toFixed(2) function to force two decimal 
        //       place input. 

        /*
        console.log("CHANGING PRICE NOW... BEFORE");
        console.log(this.state.price);
    
        var roundedNum = Math.round(this.state.price * 1e2) / 1e2;
        console.log(roundedNum);

        this.setState({
            //price: Math.round((1.00 * this.state.price + Number.EPSILON) * 100) / 100
            price: Math.round(this.state.price * 1e2) / 1e2
        })

        console.log("CHANGED PRICE... AFTER");
        console.log(this.state.price);
        */

        console.log("Listing Posted Successfully!");
        window.alert("Listing posted successfully!")

        this.props.addSellListing(this.state);

        this.setState({
          id: "",
          owner: "",
          title: "",
          description: "",
          postedDateTime: new Timestamp(0,0),
          type: "",
          image: "",
          price: 0,
          contactInfo: ""
        })
    }
  }

  render() {
    console.log(this.props.sellListings);
    console.log(this.state);

    const { auth } = this.props;
    console.log(auth);
    if (!auth.uid) return <Redirect to= '/signin'/>

    return ( 

        <div> 

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Box id="cropped-purdue-img"/>
        </Box>

      
        <form onSubmit = {this.handleSubmit}>

          <h1>Enter a title for your listing:</h1>
          <div className = "input-field">
            <label htmlFor="title">Sell-Listing Title: </label>
            <input type ="text" value={this.state.title} id="title" onChange={this.handleTitleChange}/>
          </div>

          <h1>Enter a description for your listing:</h1>
          <div className = "input-field">
            <label htmlFor="description">Sell-Listing Description: </label>
            <input type ="text" value={this.state.description} id="description" onChange={this.handleDescriptionChange}/>
          </div>

          <h1>Enter the type of listing this is:</h1>
          <div className = "input-field">
            <label htmlFor="type">Sell-Listing type: </label>
            <input type ="text" value={this.state.type} id="type" onChange={this.handleTypeChange}/>
          </div>

          <h1>Enter a price for your listing:</h1>
          <div className = "input-field">
            <label htmlFor="price">Sell-Listing price: </label>
            <input type="number" value={this.state.price} id="price" onChange={this.handlePriceChange}/>
          </div>

          <h1>Enter contact information for your listing:</h1>
          <div className = "input-field">
            <label htmlFor="contactInfo">Sell-Listing contact Info: </label>
            <input type ="text" value={this.state.contactInfo} id="contactInfo" onChange={this.handleContactInfoChange}/>
          </div>

          <div className ="input-field">
            <button className = "button">Submit Listing</button>
          </div>

          <ReactModal 
                  isOpen={this.state.showPopup}
                  contentLabel="Additional Listing Information"
                  onRequestClose={this.handleClosePopup}
                  className="Modal"
                  overlayClassName="Overlay"
                >
                <text> {this.state.validationMsg} </text>
                <button className="btn-bot" onClick={this.handleClosePopup}>Close</button>
        </ReactModal>

        </form>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    sellListings: state.firestore.ordered.sellListings,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    addSellListing: (sellListing:any) => dispatch(addSellListing(sellListing))
  }
}

export default compose<React.ComponentType<sellListingProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'sellListings'}
  ])
)(createSellListings)