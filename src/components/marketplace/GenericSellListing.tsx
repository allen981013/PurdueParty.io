import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { RootState, AppDispatch } from '../../store';
import { Timestamp } from 'firebase/firestore';
import { Redirect } from 'react-router-dom';
import { Button } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './MarketPlace.css';
import { messageListingOwner, removeSaveListing, saveListing } from '../../store/actions/sellListingActions';

// Interface/type for Events State
interface genericSelllistingState {
  messageToOwner: string
}

// Interface/type for Events Props
interface genericSelllistingProps {
  messageListingOwner: (senderID: string, receiverID: string, listingID: string, message: string) => void,
  auth: any,
  match: any,
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
  users: {
    bio: string,
    userName: string
  }[],
  saveListing: (listingID: string) => void,
  removeSaveListing: (listingID: string) => void
}

const boldText = {
  fontWeight: 'bold' as 'bold'
}

class GenericSellListing extends Component<genericSelllistingProps, genericSelllistingState> {
  // Initialize state
  constructor(props: genericSelllistingProps) {
    super(props);
    this.state = {
      messageToOwner: ""
    };
  }


  showUser(curUser: any) {

  }

  isOwner = (user: any) => {
    if (this.props.marketplace) {
      return user.id === this.props.marketplace[0].owner
    } else {
      return false;
    }
  }

  handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      messageToOwner: e.target.value,
    })
  }

  handleSubmitMessage = () => {
    const { auth } = this.props;

    if (this.state.messageToOwner.length < 4) {
      window.alert("Your message must be at least 4 characters")
    } else {
      this.props.messageListingOwner(auth.uid, this.props.marketplace[0].owner, this.props.match.params.itemID, this.state.messageToOwner)
    }
    this.setState({
      messageToOwner: ""
    })
  }

  handleSave = (event: any) => {
    event.preventDefault();
    console.log("SAVE LISTING");
    this.props.saveListing(this.props.match.params.itemID);
    //window.location.reload();
  }

  handleRemoveSave = (event: any) => {
    event.preventDefault();
    console.log("REMOVE LISTING FROM SAVED");
    this.props.removeSaveListing(this.props.match.params.itemID);
    //window.location.reload();
  }

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />

    var postDate: any = Date.now();
    if (this.props.marketplace) {
      postDate = this.props.marketplace[0].postedDateTime.toDate();
    }

    var curUser: any = undefined;
    if (this.props.users) {
      curUser = this.props.users.find(this.isOwner);
    }

    var userOnlyRender: boolean = false;
    if (curUser && (curUser.id == auth.uid)) {
      userOnlyRender = true;
    }

    var editCode: any = <div></div>;
    var saveCode: any = <div></div>;
    if (this){
      saveCode = <Button 
      // variant="outlined"
      sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%"}}
      onClick={this.handleSave}
      >
    Save
    </Button>
    }
    else {
      saveCode = <Button 
      // variant="outlined"
      sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%"}}
      onClick={this.handleRemoveSave}
      >
      Remove From Saved
      </Button>
    }
    var messageField: any = <div></div>;
    var messagingSection: any = <div></div>;
    if (userOnlyRender) {
      editCode = <Button
        component={Link}
        to={"/edit-sellListing/" + curUser.id + "/" + this.props.match.params.itemID}
        variant="outlined"
        sx={{ color: "black", height: "48px" }}
      >
        <EditOutlined sx={{ fontSize: "16px", paddingRight: "4px" }} />
        Edit
      </Button>
    } else {
      messageField = <div id={auth.uid}>
        <input type="text" value={this.state.messageToOwner} placeholder="Enter a question or comment" id={auth.uid}
          onChange={this.handleChangeMessage} />
        <div></div>
        <Button
          onClick={this.handleSubmitMessage}
          sx={{
            textTransform: "none", color: "#787c7e", fontWeight: "bold",
            fontSize: "12px", padding: "4px 4px"
          }}
          id={auth.uid}
        >
          Submit
        </Button>
      </div>;

      messagingSection =
        <div className="container-card__message">
          <p style={boldText}>Send Message to Owner:</p>
          <p>{messageField}</p>
        </div>;
    }

    return (
      <div className="container-spacer">
        <div className="container-card">
          <div className="container-card__stripe" />
          {this.showUser(curUser)}
          {this.props.marketplace != null && curUser
            ?
            <div>
              <h3>{this.props.marketplace[0].title}</h3>
              <div className="container-card__body">
                <p style={boldText}>List-Type</p>
                <p>{this.props.marketplace[0].type}</p>
              </div>
              <div className="container-card__body">
                <p style={boldText}>Sold By</p>
                <p>{curUser.userName}</p>
              </div>
              <div className="container-card__body">
                <p style={boldText}>Price</p>
                <p>${this.props.marketplace[0].price}</p>
              </div>
              <div className="container-card__body">
                <p style={boldText}>Contact Info</p>
                <p>{curUser.email}</p>
                <p>{this.props.marketplace[0].contactInfo}</p>
              </div>
              {messagingSection}
              <div className="container-card__desc">
                <p style={boldText}>Description</p>
                <p>{this.props.marketplace[0].description}</p>
              </div>
              <div className="container-card__desc">
                <img src={this.props.marketplace[0].image} style={{ width: "95%" }} />
              </div>
              {editCode}
              <div className="container-card__dateTime">
                <p>Posted On: {postDate.toString()}</p>
              </div>
            </div>
            :
            <div></div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    marketplace: state.firestore.ordered.sellListings,
    users: state.firestore.ordered.users
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Return functions for signIn
  return {
    messageListingOwner: (senderID: string, receiverID: string, listingID: string, message: string) => dispatch(messageListingOwner(senderID, receiverID, listingID, message)),
    saveListing: (listingID: string) => dispatch(saveListing(listingID)),
    removeSaveListing: (listingID: string) => dispatch(removeSaveListing(listingID))
  }
}

export default compose<React.ComponentType<genericSelllistingProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: genericSelllistingProps) => {
    if (typeof props.match.params != "undefined") {
      return [
        {
          collection: 'sellListings',
          doc: props.match.params.itemID
        },
        {
          collection: 'users'
        }
      ]
    } else {
      return []
    }
  })
)(GenericSellListing)