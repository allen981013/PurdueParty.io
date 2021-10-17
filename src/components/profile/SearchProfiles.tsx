import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, Card, CardContent, Typography } from '@mui/material';

// Interface/type for Profile State
interface SearchProfilesState {
    searchField: string
}

// Interface/type for Profile Props
interface SearchProfilesProps {
    profile: {
        bio: string,
        userName: string,
        major: string,
        year: number
    }[],
    currentUser: string,
    auth: any,
    firebase: any
}

class SearchProfiles extends Component<SearchProfilesProps, SearchProfilesState> {

    constructor(props: SearchProfilesProps) {
        super(props);
        this.state = {
            searchField: ""
        }
    }

    getUser(bio: string, userName: string, major: string, year: number) {

        if (userName == this.props.currentUser) {
            return (
                <Grid
                    item
                    id="image-container"
                    xs={12}
                    md={3}
                >
                    <Card>
                        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <label htmlFor="title">User Name: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {userName}
                            </Typography>
                            <label htmlFor="title">Bio: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {bio}
                            </Typography>
                            <label htmlFor="title">Major: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {major}
                            </Typography>
                            <label htmlFor="title">Year: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {year}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )
        }
        return null
    }

    checkUser(userName: string) {
        if (userName == this.props.currentUser) {
            return true;
        }
        return false;
    }


    handleSearchChange(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({
            searchField: e.target.value
        })
    }

    handleSubmit(event: any){
        event.preventDefault();


    }

    render() {
        const { auth } = this.props;

        if (!auth.uid) return <Redirect to='/signin' />

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        Search For Profiles:
                    </p>
                    <input type="profileSearch" value={this.state.searchField} id="profileSearchWord" onChange={this.handleSearchChange} />
                    <p></p>
                    <button>Search</button>
                </form>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <Box id="cropped-purdue-img" />
                    <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                        {this.props.profile != undefined && this.props.profile.length != 0
                            ?
                            this.props.profile.map((users) => this.getUser(users.bio, users.userName, users.major, users.year))
                            :
                            <div>Profile Missing</div>
                        }
                    </Grid>
                </Box>

            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        profile: state.firestore.ordered.users,
        auth: state.firebase.auth,
        currentUser: state.auth.lastCheckedUsername
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
    }
}

export default compose<React.ComponentType<SearchProfiles>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' }
    ])
)(SearchProfiles)