import React, { Component } from 'react';
import { compose } from 'redux';
import { editUser } from '../../store/actions/profileActions';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom'
import { Box } from '@mui/material';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

// Interface/type for EditProfile State
interface EditProfileState{
    id: string,
    bio: string,
    userName: string,
    major: string,
    year: string
}

// Interface/type for EditProfile Props
interface EditProfileProps{
    auth: any,
    firebase: any,
    editProfile: (state: EditProfileState) => void
}

class EditProfile extends Component<EditProfileProps, EditProfileState> {

    constructor(props:EditProfileProps){
        super(props);
        this.state = {
            id:"",
            bio: "",
            userName: "",
            major: "",
            year:""
        }
    }

    handleChangeBio = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            bio: e.target.value
        })
    }

    handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            userName: e.target.value
        })
    }

    handleChangeMajor = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            major: e.target.value
        })
    }

    handleChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            year: e.target.value
        })
    }


    handleSubmit = (event:any) => {
        event.preventDefault();
    
        if (this.state.bio.length > 280) { 
            // Pop modal for title length error
            console.log("Bio must be shorter than 280 characters.");
            window.alert("Bio must be shorter than 280 characters.")
        }
        else if (this.state.userName.length < 3) {
            // Pop modal for description length error
            console.log("Minimum User Name Length Required: 3 characters");
            window.alert("Minimum User Name length required: 3 characters")
        }
        else {
            console.log("Profile has been edited!");
            window.alert("Profile has been edited!")
    
            this.props.editProfile(this.state);
    
            this.setState({
              id: "",
              bio: "",
              userName: "",
              major: "",
              year: ""
            })
        }
      }

    render() {
        const { auth } = this.props;

        if (!auth.uid) return <Redirect to='/signin'/>

        return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
        <form onSubmit={this.handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1>User Name</h1>
          <div className="input-field">
            <label htmlFor="title">User Name </label>
            <input type="text" value={this.state.userName} placeholder=""
              id="title" onChange={this.handleChangeUserName} />
          </div>

          <h1>Bio</h1>
          <div className="input-field">
            <label htmlFor="title">Bio </label>
            <input type="text" value={this.state.bio} placeholder=""
              id="title" onChange={this.handleChangeBio} />
          </div>

          <h1>Major</h1>
          <div className="input-field">
            <label htmlFor="title">Major </label>
            <input type="text" value={this.state.major} placeholder=""
              id="title" onChange={this.handleChangeMajor} />
          </div>

          <h1>Year</h1>
          <div className="input-field">
            <label htmlFor="title">Year </label>
            <input type="text" value={this.state.year} placeholder=""
              id="title" onChange={this.handleChangeYear} />
          </div>

          <div className="input-field">
            <button className="button">Create New Event</button>
          </div>

        </form>
      </Box>
    )
    }
}


const mapStateToProps = (state: RootState) => {
    return {
        auth: state.firebase.auth,
        profile: state.firestore.ordered.users
    }
  }
  
  const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        EditProfile: (profile: any) => dispatch(editUser(profile))
    }
  }
  
  export default compose<React.ComponentType<EditProfileProps>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'users' }
    ])
  )(EditProfile)