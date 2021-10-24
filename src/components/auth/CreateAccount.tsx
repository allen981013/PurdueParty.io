import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signUp } from '../../store/actions/authActions';
import { RootState, AppDispatch } from '../../store'
import { getFirebase } from 'react-redux-firebase';
import { constants } from 'redux-firestore';
import { Redirect } from 'react-router-dom';
import Dropzone from 'react-dropzone'

// Interface/type for create account State
interface CreateAccountState {
  username: string,
  email: string,
  password: string,
  confirmpassword: string,
  bio: string,
  canEditClubs: string[],
  profilePic: File,
  redirect: boolean,
  errormsg: string,
}

// Interface/type for create account Props
interface CreateAccountProps {
  auth: any,
  authError: any,
  signUp: (state: CreateAccountState) => void
  checkUsername: (state: CreateAccountState) => void
}

class CreateAccount extends Component<CreateAccountProps, CreateAccountState> {
  // Initialize state

  constructor(props: CreateAccountProps) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      bio: "",
      canEditClubs: [],
      profilePic: null as any,
      redirect: false,
      errormsg: ""
    };
  }

  // State updater during form modification
  handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: e.target.value
    })
  }

  // State updater during form modification
  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: e.target.value
    })
  }

  // State updater during form modification
  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value
    })
  }

  // State updater during form modification
  handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      confirmpassword: e.target.value
    })
  }

  handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      bio: e.target.value
    })
  }

  // General purpose state updater during form modification
  handleInputImage = (e: File) => {
    console.log(typeof (e));
    console.log(e);
    console.log(this.state);

    if (e == undefined) {
      window.alert("Please enter a valid file with a .JPG, .PNG, .JPEG extension.")
    }
    else {
      this.setState({
        profilePic: e
      })
    }
  }

  // Handle user submit
  handleSubmit = (event: any) => {
    event.preventDefault();

    //check for empty requried fields
    if (this.state.username === "" || this.state.email === "" || this.state.password === "" || this.state.confirmpassword === "") {
      this.setState({
        errormsg: "Please fill at least the username, the email, and both password fields"
      })
    }
    //check that email is purdue email
    else if (!this.state.email.includes('@purdue.edu', this.state.email.length - 11)) {
      this.setState({
        errormsg: "Only Purdue email addresses are allowed for Account Creation!"
      })
    }
    //check email is valid
    else if (this.state.email.length < 12) {
      this.setState({
        errormsg: "Email must be valid!"
      })
    }
    //check max bio length
    else if (this.state.bio.length > 256) {
      this.setState({
        errormsg: "Bio cannot be longer that 256 characters in length"
      })
    }
    //check that passwords match and are valid
    else if (this.state.password === this.state.confirmpassword && this.state.password.length > 5) {
      this.props.signUp(this.state);
      this.setState({
        redirect: true
      })
    }
    else {
      this.setState({
        errormsg: "Please make sure your passwords are matching and contain at least 6 characters"
      })
    }
  }


  render() {
    //redirect to homepage upon successful account creation

    const { auth } = this.props;
    const { authError } = this.props;
    if (auth.uid) {
      this.setState({
        errormsg: "Account creation successful",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
        bio: "",
        canEditClubs: [],
        profilePic: null as any,
        redirect: false
      })
      return <Redirect to='/' />
      //error message if account exists
    } else if (authError && this.state.redirect == true) {
      this.setState({
        errormsg: "Please make sure your account does not already exist",
        redirect: false
      })
    }

    const renderimage = () => {
      if (this.state.profilePic == null as any) {
        return;
      } else {
        return <img src={URL.createObjectURL(this.state.profilePic)}/>;
      }
    }

    return (
      <div className="createaccount">
        <h1>If you like to party, create your account!</h1>
        <form onSubmit={this.handleSubmit}>
          <p>
            Username:
          </p>
          <input type="text" value={this.state.username} id="username" onChange={this.handleUsernameChange} />
          <p>
            Email:
          </p>
          <input type="text" value={this.state.email} id="email" onChange={this.handleEmailChange} />
          <p>
            Password:
          </p>
          <input type="password" value={this.state.password} id="password" onChange={this.handlePasswordChange} />
          <p>
            Confirm Password:
          </p>
          <input type="password" value={this.state.confirmpassword} id="confirmPassword" onChange={this.handleConfirmPasswordChange} />
          <p>
            Bio:
          </p>
          <input type="text" value={this.state.bio} id="bio" onChange={this.handleBioChange} />
          <p></p>

          <Dropzone
            accept="image/jpeg, image/jpg, image/png"
            maxFiles={1}
            onDrop={inputtedFile => 
              this.handleInputImage(inputtedFile[0])
            }
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Click here to upload a profile picture. JPG, JPEG, or PNG only.</p>
                </div>
              </section>
            )}
          </Dropzone>

          <p></p>

          {renderimage()}

          <p></p>
          <button>Create Account</button>
        </form>
        <p>
          {this.state.errormsg}
        </p>
      </div>
    )
  }
}



const mapStateToProps = (state: any) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Return functions for signUp
  return {
    signUp: (creds: any) => dispatch(signUp(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);