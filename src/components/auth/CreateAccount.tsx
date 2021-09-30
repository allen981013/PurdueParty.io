import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signUp } from '../../store/actions/authActions';
import { RootState, AppDispatch } from '../../store'
import { getFirebase } from 'react-redux-firebase';
import { constants } from 'redux-firestore';
import { Redirect } from 'react-router-dom';

// Interface/type for create account State
interface CreateAccountState {
  email: string,
  password: string,
  confirmpassword: string,
  bio: string,
  redirect: boolean,
  errormsg: string
}

// Interface/type for create account Props
interface CreateAccountProps {
  auth: any,
  authError: any,
  signUp: (state: CreateAccountState) => void
}

class CreateAccount extends Component<CreateAccountProps, CreateAccountState> {
  // Initialize state

  constructor(props: CreateAccountProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmpassword: "",
      bio: "",
      redirect: false,
      errormsg: ""
    };
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

  // Handle user submit
  handleSubmit = (event: any) => {
    event.preventDefault();

    //check for empty requried fields
    if (this.state.email === "" || this.state.password === "" || this.state.confirmpassword === "") {
      this.setState({
        errormsg: "Please fill at least the email and both password fields"
      })
    }
    //check that email is purdue email
    else if (!this.state.email.includes('@purdue.edu', this.state.email.length - 11)) {
      this.setState({
        errormsg: "Only Purdue email addresses are allowed for Account Creation!"
      })
    }
    //check that passwords match
    else if (this.state.password === this.state.confirmpassword) {
      this.props.signUp(this.state);
      this.setState({
        redirect: true
      })
    }
    else {
      this.setState({
        errormsg: "Please make sure your passwords are matching"
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
        email: "",
        password: "",
        confirmpassword: "",
        bio: "",
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

    return (
      <div className="createaccount">
        <h1>If you like to party, create your account!</h1>
        <form onSubmit={this.handleSubmit}>
          <p>
            Email:
          </p>
          <input type="text" value={this.state.email} id="email" onChange={this.handleEmailChange} />
          <p>
            Password:
          </p>
          <input type="text" value={this.state.password} id="password" onChange={this.handlePasswordChange} />
          <p>
            Confirm Password:
          </p>
          <input type="text" value={this.state.confirmpassword} id="confirmPassword" onChange={this.handleConfirmPasswordChange} />
          <p>
            Bio:
          </p>
          <input type="text" value={this.state.bio} id="bio" onChange={this.handleBioChange} />
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