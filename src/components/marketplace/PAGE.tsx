import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signIn } from '../../store/actions/authActions';
import {RootState, AppDispatch} from '../../store'

// Interface/type for Events State
interface a {
}

// Interface/type for Events Props
interface aProps {
    auth: any
}

class test extends Component<aProps, a> {
  // Initialize state
  constructor(props:aProps) {
    super(props);
    this.state = {
    };
  }

  // State updater during form modification
  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email : e.target.value
    })
  }


  render() {
    //console.log(this.props.auth);
    return (
      <div className="login">
        <h1> UNIQUE PAGE HERE </h1>
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

export default connect(mapStateToProps, mapDispatchToProps)(test);