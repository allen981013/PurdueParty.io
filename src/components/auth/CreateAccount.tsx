import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signUp } from '../../store/actions/authActions';
import {RootState, AppDispatch} from '../../store'

// Interface/type for create account State
interface CreateAccountState {
  email: string,
  password: string,
  confirmpassword: string,
  bio: string
}

// Interface/type for create account Props
interface CreateAccountProps {
    auth: any,
    signUp: (state:CreateAccountState) => void
}

class CreateAccount extends Component<CreateAccountProps, CreateAccountState> {
  // Initialize state

  constructor(props:CreateAccountProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmpassword: "",
      bio: ""
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

  // State updater during form modification
  handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      confirmpassword : e.target.value
    })
  }

  // Handle user submit
  handleSubmit = (event:any) => {
    event.preventDefault();
    if(this.state.password === this.state.confirmpassword){
        this.props.signUp(this.state);
        this.setState({
            email: "",
            password: "",
            confirmpassword: ""
        })
    }
  }

  


  render() {
    //console.log(this.props.auth);
    return (
      <div className="createaccount">
        <h1>If you like to party, create your account!</h1>
        <form onSubmit={this.handleSubmit}>
          <p>
            Email:
          </p>
          <input type="text" value={this.state.email} id="email" onChange={this.handleEmailChange}/>
          <p>
            Password: 
          </p>
          <input type="text" value={this.state.password} id="email" onChange={this.handlePasswordChange}/>
          <p>
            Confirm Password: 
          </p>
          <input type="text" value={this.state.confirmpassword} id="password"  onChange={this.handleConfirmPasswordChange}/>
          <p></p>
          <button>Create Account</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Return functions for signUp
  return {
    signUp: (creds:any) => dispatch(signUp(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);