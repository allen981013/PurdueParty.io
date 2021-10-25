import React, { Component } from 'react';
import { compose } from 'redux';
import { editUser } from '../../store/actions/profileActions';
import { deleteAccount } from '../../store/actions/authActions';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom'
import { Box } from '@mui/material';

// Interface/type for EditProfile State
interface EditProfileState {
  id: string,
  bio: string,
  userName: string,
  major: string,
  year: string,
  hide: boolean,
  hasUpdated: boolean
}

// Interface/type for EditProfile Props
interface EditProfileProps {
  auth: any,
  firebase: any,
  uid: string,
  profile: any,
  deleteAccount: () => void;
  editUser: (state: EditProfileState) => void,
  editStatus: string
}

class EditProfile extends Component<EditProfileProps, EditProfileState> {

  constructor(props: EditProfileProps) {
    super(props);
    this.state = {
      id: "",
      bio: "",
      userName: "",
      major: "",
      year: "",
      hide: false,
      hasUpdated: false
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

  handleChangeHide = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      hide: e.target.checked
    })
  }


  handleDelete = (event: any) => {
    event.preventDefault()
    if (window.confirm('Are you sure you wish to delete your account?')) {
      this.props.deleteAccount();
    }
  }


  handleSubmit = (event: any) => {
    event.preventDefault();

    if (this.state.bio.length > 0 && this.state.bio.length > 280) {
      // Pop modal for title length error
      console.log("Bio must be shorter than 280 characters.");
      window.alert("Bio must be shorter than 280 characters.")
    }
    else if (this.state.userName.length > 0 && this.state.userName.length < 3) {
      // Pop modal for description length error
      console.log("Minimum User Name Length Required: 3 characters");
      window.alert("Minimum User Name length required: 3 characters")
    }
    else {
      this.setState({
        id: this.props.uid
      })

      this.props.editUser(this.state);

      setTimeout(() => {
        if (this.props.editStatus != undefined) {
          if (this.props.editStatus.localeCompare('Edit profile success') == 0) {
            console.log("Profile has been edited!");
            window.alert("Profile has been edited!");
          } else {
            window.alert("Your chosen username is not unique. Please select a new one.");
          }
        }
      }, 1000)

      /*
      this.setState({
        bio: "",
        userName: "",
        major: "",
        year: "",
        hide: false
      })
      */
    }
  }

  render() {
    const { auth } = this.props;

    if (!auth.uid) return <Redirect to='/' />
    var userProfile : any = undefined;

    if (this.props.profile && this.props.profile.length == 1) {
      //console.log(this.props.profile);
      userProfile = this.props.profile[0];
    }

    if (!this.state.hasUpdated && userProfile != undefined) {
      this.setState({
        bio: userProfile.bio,
        userName: userProfile.userName
      })

      if (userProfile.hasOwnProperty('major')) {
        this.setState({
          major: userProfile.major
        })
      }

      
      if (userProfile.hasOwnProperty('year')) {
        this.setState({
          year: userProfile.year
        })
      }

      this.setState({
        hasUpdated: true
      })
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
        <p></p>
        <form onSubmit={this.handleDelete}>
          <button>Delete Account</button>
        </form>
        <form onSubmit={this.handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1>User Name</h1>
          <div className="input-field">
            <input type="text" value={this.state.userName} placeholder=""
              id="title" onChange={this.handleChangeUserName} />
          </div>

          <h1>Bio</h1>
          <div className="input-field">
            <input type="text" value={this.state.bio} placeholder=""
              id="title" onChange={this.handleChangeBio} />
          </div>

          <h1>Major</h1>
          <div className="input-field">
            <input type="text" value={this.state.major} placeholder=""
              id="title" onChange={this.handleChangeMajor} />
          </div>

          <h1>Year</h1>
          <div className="input-field">
            <input type="text" value={this.state.year} placeholder=""
              id="title" onChange={this.handleChangeYear} />
          </div>

          <h1>Hide Your Profile
            <input type="checkbox" checked={this.state.hide} placeholder=""
              id="title" onChange={this.handleChangeHide} style={{marginLeft: "15px"}} />
          </h1>

          <div className="input-field">
            <button className="button">Save</button>
          </div>

        </form>
      </Box>
    )
  }
}


const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    profile: state.firestore.ordered.users,
    uid: state.firebase.auth.uid,
    editStatus: state.profileReducer.editStatus
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    editUser: (profile: any) => dispatch(editUser(profile)),
    deleteAccount: () => dispatch(deleteAccount())
  }
}

export default compose<React.ComponentType<EditProfileProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props:EditProfileProps) => {
    if (typeof props.auth != undefined) {
      return [
        {
          collection: 'users',
          doc: props.auth.uid
        }
      ]
    } else {
      return []
    }
  })
)(EditProfile)