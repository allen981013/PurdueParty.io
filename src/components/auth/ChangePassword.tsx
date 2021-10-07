import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changePassword } from '../../store/actions/authActions';
import { RootState, AppDispatch } from '../../store'
import { getFirebase } from 'react-redux-firebase';
import { constants } from 'redux-firestore';
import { Redirect } from 'react-router-dom';

// Interface/type for create account State
interface ChangePasswordState {
  newpassword: string,
  confirmpassword: string,
  redirect: boolean,
  errormsg: string
}

// Interface/type for create account Props
interface ChangePasswordProps {
  auth: any,
  authError: any,
  changePassword: (newPass: string) => void
}

class ChangePassword extends Component<ChangePasswordProps, ChangePasswordState> {
  // Initialize state

  constructor(props: ChangePasswordProps) {
    super(props);
    this.state = {
      newpassword: "",
      confirmpassword: "",
      redirect: false,
      errormsg: ""
    };
  }

  // State updater during form modification
  handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newpassword: e.target.value
    })
  }

  // State updater during form modification
  handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      confirmpassword: e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event: any) => {
    event.preventDefault();

    //check for empty requried fields
    //check for empty requried fields
    if (this.state.newpassword === this.state.confirmpassword && this.state.newpassword.length > 5) {
      this.props.changePassword(this.state.newpassword);
      this.setState({
        redirect: true
      })
    }
    else if(this.state.newpassword.length <= 5){
      this.setState({
        errormsg: "Password is not secure, make sure it is at least 6 characters"
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

    if (this.state.redirect == true) {
      return <Redirect to='/' />
    }

    return (
      <div className="createaccount">
        <h1>If you would like to change your password, enter a new one below!</h1>
        <form onSubmit={this.handleSubmit}>
          <p>
            New Password:
          </p>
          <input type="password" value={this.state.newpassword} id="newpassword" onChange={this.handleNewPasswordChange} />
          <p>
            Confirm Password:
          </p>
          <input type="password" value={this.state.confirmpassword} id="confirmPassword" onChange={this.handleConfirmPasswordChange} />
          <p></p>
          <button>Change Password</button>
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
  // Return functions for changePassword
  return {
    changePassword: (creds: any) => dispatch(changePassword(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);