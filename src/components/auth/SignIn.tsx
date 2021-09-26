import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signIn } from '../../store/actions/authActions';
import {RootState, AppDispatch} from '../../store'
import { Dispatch, Action } from 'redux';
import { getFirebase } from 'react-redux-firebase';

// Interface/type for Events State
interface SignInState {
  email: string,
  password: string,
  errormsg: string
}

// Interface/type for Events Props
interface SignInProps {
    auth: any,
    signIn: (state:SignInState) => void
}

class SignIn extends Component<SignInProps, SignInState> {
  // Initialize state
  constructor(props:SignInProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errormsg: ""
    };
  }

  // State updater during form modification
  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email : e.target.value
    })
  }

  // State updater during form modification
  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password : e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event:any) => {
    event.preventDefault();
    this.props.signIn(this.state);
    const firebase = getFirebase();
    const user = firebase.auth().currentUser;
    if(user != null && user.email === this.state.email){
      this.setState({
        errormsg: "Sign-in successful",
        email: "",
        password: ""
      })
    }
    else {
      this.setState({
        errormsg: "Please make sure Email and Password are both valid"      
      })
    }
  }

  render() {
    //console.log(this.props.auth);
    return (
      <div className="login">
        <h1>If you like to party, enter your login info</h1>
        <form onSubmit={this.handleSubmit}>
          <p>
            Username:
          </p>
          <input type="text" value={this.state.email} id="email" onChange={this.handleEmailChange}/>
          <p>
            Password: 
          </p>
          <input type="text" value={this.state.password} id="password"  onChange={this.handlePasswordChange}/>
          <p></p>
          <button>Login</button>
          <p>
            {this.state.errormsg}
          </p>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Return functions for signIn
  return {
    signIn: (creds:any) => dispatch(signIn(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
