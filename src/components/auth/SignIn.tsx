import React, { Component } from 'react';
import { connect } from 'react-redux';

// Interface/type for Events State
interface SignInState {
  email: string,
  password: string
}

// Interface/type for Events Props
interface SignInProps {
    auth: any
}

class SignIn extends Component<SignInProps, SignInState> {
  // Initialize state
  constructor(props:SignInProps) {
    super(props);
    this.state = {
      email: "",
      password: ""
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
    this.setState({
      email: "",
      password: ""
    })
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
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => {
  return {
    auth: state.signIn.auth
    //authError: state.auth.authError,
    //auth: state.firebase.auth
  }
}

/*
const mapDispatchToProps = (dispatch) => {
  // Return functions for signIn
  return {
    loadEvents : =
  }
}

export default connect(mapState)
*/

export default connect(mapStateToProps)(SignIn);