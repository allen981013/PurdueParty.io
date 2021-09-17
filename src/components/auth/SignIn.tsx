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
  render() {
    //console.log(this.props.auth);
    return (
      <div>
        <h1>Sign In Page</h1>
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