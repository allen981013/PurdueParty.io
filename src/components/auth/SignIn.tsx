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
  userInput = (e: { target: { value: any; }; }) => {
    this.setState({
      email: e.target.value
    });
  }
  passInput = (e: { target: { value: any; }; }) => {
    this.setState({
      password: e.target.value
    });
  }
  checkInputs = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    mapStateToProps(this.state);
  }

  render() {
    console.log(this.props.auth);
    return (
      <div className="login">
      <h1>If you like to party, enter your login info</h1>
      <form onSubmit={this.checkInputs}>
        <p>
          Email:
        </p>
        <input type="text" onChange={this.userInput}/>
        <p>
          Password: 
        </p>
        <input type="text" onChange={this.passInput}/>
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