import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changePassword, reAuthenticate } from '../../store/actions/authActions';
import { RootState, AppDispatch } from '../../store'
import { Redirect } from 'react-router-dom';

// Interface/type for create account State
interface ChangePasswordState {
  newpassword: string,
  confirmpassword: string,
  redirect: boolean,
  errormsg: string,
  email: string,
  password: string
}

// Interface/type for create account Props
interface ChangePasswordProps {
  auth: any,
  authError: any,
  changePassword: (newPass: string) => void
  reAuthenticate: (credentials: any) => void
}

class ChangePassword extends Component<ChangePasswordProps, ChangePasswordState> {
  // Initialize state

  constructor(props: ChangePasswordProps) {
    super(props);
    this.state = {
      newpassword: "",
      confirmpassword: "",
      redirect: false,
      errormsg: "",
      email: "",
      password: ""
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

  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: e.target.value
    })
  }

  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value
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

  /*
  handleReauth = (event: any) => {
    this.props.reAuthenticate(this.state);
  }
  */

  render() {
    //redirect to homepage upon successful account creation

    const { auth } = this.props;
    const { authError } = this.props;

    if (this.state.redirect == true) {
      return <Redirect to='/' />
    }

    /*
    if (this.props.authError != undefined && this.props.authError.localeCompare('Change user password error')) {
      return (
        <div className="login-form">
          <div className="form-box solid">
            <form onSubmit={this.handleReauth}>
              <h1 className="login-text">Please Reauthenticate</h1>
              <label>Email</label><br></br>
              <input type="text" value={this.state.email} id="email" onChange={this.handleEmailChange} /> <br></br>
              <label>Password</label> <br></br>
              <input type="password" value={this.state.password} id="password" onChange={this.handlePasswordChange} /> <br></br>
              <button>Reauthenticate</button>
            </form>
          </div>
        </div>
      )
    } else if (this.props.authError != undefined && this.props.authError.localeCompare('Error during user reauthentication')) {
      window.alert("Error during user reauthentication. Please try again");
    }
    */

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
    changePassword: (creds: any) => dispatch(changePassword(creds)),
    reAuthenticate: (credentials: any) => dispatch(reAuthenticate(credentials))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);