import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { FirebaseReducer } from 'react-redux-firebase';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import {Box, Button, CircularProgress, Grid, Card, CardActionArea, CardMedia, CardContent, Typography} from '@mui/material';

// Interface/type for EditProfile State
interface EditProfileState{
}

// Interface/type for EditProfile Props
interface EditProfileProps{
    profile: {
        
    }[],
    auth: any,
    firebase: any
}

class EditProfile extends Component<EditProfileProps, EditProfileState> {

    constructor(props:EditProfileProps){
        super(props);
        this.state = {
        }
    }
    render() {
        const { auth } = this.props;

        if (!auth.uid) return <Redirect to='/signin'/>

        return (
            <div> 
            </div>
        )
    }
}


const mapStateToProps = (state: RootState) => {
    return {
        auth: state.firebase.auth,
    }
  }
  
  const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)