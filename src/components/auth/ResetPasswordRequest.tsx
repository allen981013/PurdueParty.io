import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetPasswordRequest } from '../../store/actions/authActions';
import { RootState, AppDispatch } from '../../store'
import { getFirebase } from 'react-redux-firebase';
import { constants } from 'redux-firestore';
import { Redirect } from 'react-router-dom';

// Interface/type for create account State
interface ResetPasswordState {
  email: string,
  redirect: boolean,
  errormsg: string
}

// Interface/type for create account Props
interface ResetPasswordProps {
  auth: any,
  authError: any,
  resetPasswordRequest: (state: ResetPasswordState) => void
}

class ResetPassword extends Component<ResetPasswordProps, ResetPasswordState> {
  // Initialize state

  constructor(props: ResetPasswordProps) {
    super(props);
    this.state = {
      email: "",
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

  // Handle user submit
  handleSubmit = (event: any) => {
    event.preventDefault();

    //check for empty requried fields
    if (this.state.email.length < 12) {
      this.setState({
        errormsg: "Please enter a valid email address."
      })
    }
    else if (!this.state.email.includes('@purdue.edu', this.state.email.length - 11)) {
        this.setState({
          errormsg: "Only Purdue email addresses are allowed!"
        })
    }
    else {
      this.props.resetPasswordRequest(this.state);
      this.setState({
        redirect: true
      })
    }
  }

  render() {
    //redirect to homepage upon successful password reset

    const { auth } = this.props;
    const { authError } = this.props;
    if (auth.uid) {
      this.setState({
        errormsg: "Password reset successful",
        email: "",
        redirect: false
      })
      return <Redirect to='/' />
      //error message if account exists
    } else if (authError && this.state.redirect == true) {
      this.setState({
        errormsg: "Please make sure your email is correct.",
        redirect: false
      })
    } else if (!authError && this.state.redirect == true) {
      window.alert('Reset password email sent successfully.');
      return <Redirect to='/' />
    }

    return (
      <div className="createaccount">
        <h1>If you would like to reset your password, enter your email below!</h1>
        <form onSubmit={this.handleSubmit}>
          <p>
            Email:
          </p>
          <input type="text" value={this.state.email} id="email" onChange={this.handleEmailChange} />
          <p></p>
          <button>Reset Password</button>
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
    resetPasswordRequest: (creds: any) => dispatch(resetPasswordRequest(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);