import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import {RootState, AppDispatch} from '../../store';
import { Timestamp} from 'firebase/firestore';
import { Redirect } from 'react-router-dom';
import './MarketPlace.css';

// Interface/type for Events State
interface genericSelllistingState {

}

// Interface/type for Events Props
interface genericSelllistingProps {
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
  }[]
}

const boldText = {
  fontWeight: 'bold' as 'bold'
}

class GenericSellListing extends Component<genericSelllistingProps, genericSelllistingState> {
  // Initialize state
  constructor(props:genericSelllistingProps) {
    super(props);
    this.state = {

    };
  }


  showUser (curUser:any) {
      console.log("USER IS HERE")
      console.log(curUser);
  }

  isOwner = (user:any) => {
    if (this.props.marketplace) {
      return user.id === this.props.marketplace[0].owner
    } else {
      return false;
    }
  }

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />

    var postDate:any = Date.now();
    if (this.props.marketplace) {
      postDate = this.props.marketplace[0].postedDateTime.toDate();
      console.log(this.props.marketplace[0].image);
    }

    var curUser : any = "User";
    if (this.props.users) {
      curUser = this.props.users.find(this.isOwner);
    }

    return (
      <div className="container-spacer">
        <div className="container-card">
            <div className="container-card__stripe" />
            {this.showUser(curUser)}
            { this.props.marketplace != null && curUser
                ?
                <div>
                  <h3>{this.props.marketplace[0].title}</h3>
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

                  <div className="container-card__desc">
                    <p style={boldText}>Description</p>
                    <p>{this.props.marketplace[0].description}</p>
                  </div>
                  <div className="container-card__desc">
                    <img src = {this.props.marketplace[0].image} style = {{ width : "95%"}} />
                  </div>
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
    
  }
}

export default compose<React.ComponentType<genericSelllistingProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props:genericSelllistingProps) => {
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