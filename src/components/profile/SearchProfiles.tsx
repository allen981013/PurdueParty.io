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
    searchField: string,
    searchStarted: boolean,
    sortedProfiles: {
        bio: string,
        userName: string,
        email: string,
        hide: boolean
    }[]
}

// Interface/type for Profile Props
interface SearchProfilesProps {
    profile: {
        bio: string,
        userName: string,
        email: string,
        hide: boolean
    }[],
    currentUser: string,
    auth: any,
    firebase: any
}

class SearchProfiles extends Component<SearchProfilesProps, SearchProfilesState> {

    constructor(props: SearchProfilesProps) {
        super(props);
        this.state = {
            searchField: "",
            searchStarted: false,
            sortedProfiles: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    getUser(bio: string, userName: string, hide: boolean, email: string) {

        if (!hide) {
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
                            <label htmlFor="title">Email: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {email}
                            </Typography>
                            <label htmlFor="title">Bio: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {bio}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>
            )
        }
        return null
    }


    sortResults() {
        let profiles = [...this.props.profile]

        var email1;
        var username1;
        var email2;
        var username2;
        var searchText;
        for (let i = 0; i < profiles.length - 1; i++) {
            for (let j = 0; j < profiles.length - i - 1; j++) {
                email1 = profiles[j].email.substring(0, profiles[j].email.indexOf('@')).toLowerCase();
                username1 = profiles[j].userName.toLowerCase();
                email2 = profiles[j + 1].email.substring(0, profiles[j].email.indexOf('@')).toLowerCase();
                username2 = profiles[j + 1].userName.toLowerCase();

                if(this.state.searchField.indexOf('@') == -1){
                    searchText = this.state.searchField.toLowerCase();
                } else {
                    searchText = this.state.searchField.substring(0, profiles[j].email.indexOf('@')).toLowerCase();
                }

                if ((username2 === searchText || email2 === searchText)
                 || ((username2.includes(searchText) || email2.includes(searchText)) && (!username1.includes(searchText) && !email1.includes(searchText)))
                 || ((username2.includes(searchText) && email2.includes(searchText)) && (username1.includes(searchText) ? !email1.includes(searchText) : email1.includes(searchText)))) {
                    let hold = profiles[j];
                    profiles[j] = profiles[j + 1];
                    profiles[j + 1] = hold;
                }
            }
        }

        this.setState({
            sortedProfiles: profiles
        })
    }



    handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            searchField: e.target.value
        })
    }

    handleSubmit(event: any) {
        event.preventDefault();
        this.sortResults()
        this.setState({
            searchStarted: true
        })
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
                    <input type="profileSearch" value={this.state.searchField} id="searchField" onChange={this.handleSearchChange} />
                    <p></p>
                    <button>Search</button>
                </form>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <Box id="cropped-purdue-img" />
                    <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                        {this.props.profile != undefined && this.props.profile.length != 0 && this.state.searchStarted
                            ?
                            this.state.sortedProfiles.map((users) => this.getUser(users.bio, users.userName, users.hide, users.email))
                            :
                            <div>Type in a username or email to search for profiles.</div>
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