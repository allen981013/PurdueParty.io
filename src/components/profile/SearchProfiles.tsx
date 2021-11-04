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
    profileSelected: boolean,
    sortedProfiles: {
        bio: string,
        userName: string,
        email: string,
        hide: boolean,
        year: number,
        major: string
    }[],
    displayProfile: {
        bio: string,
        userName: string,
        email: string,
        hide: boolean,
        year: number,
        major: string
    },
    profileFound: boolean
}

// Interface/type for Profile Props
interface SearchProfilesProps {
    profile: {
        bio: string,
        userName: string,
        email: string,
        hide: boolean,
        year: number,
        major: string
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
            profileSelected: false,
            displayProfile: {
                bio: "null",
                userName: "null",
                email: "null",
                hide: false,
                year: 0,
                major: "null"
            },
            sortedProfiles: [],
            profileFound: false

        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleProfileClick(bio: string, userName: string, email: string, hide: boolean, year: number, major: string) {
        let profile = {
            bio: bio,
            userName: userName,
            email: email,
            hide: hide,
            year: year,
            major: major
        }

        this.setState({
            displayProfile: profile,
            profileSelected: true,
        })

    }

    displayUserProfile(bio: string, userName: string, major: string, year: number) {
        if (!this.state.searchStarted && (userName === 'null' && year == 0)) {
            return (<div>Type in a user's email or username.</div>)
        }
        else if (!this.state.profileFound) {
            return (<div>No profiles match your search.</div>)
        }
        else {
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
    }

    getUser(year: number, userName: string, hide: boolean, email: string, bio: string, major: string) {
        if (!hide) {
            return (
                <Button
                    onClick={() => this.handleProfileClick(bio, userName, email, hide, year, major)}
                    title={email}
                    className="item-card"
                    sx={{ color: "black", fontWeight: "light", textTransform: "unset" }}
                >
                    <div className="item-card__stripe" />
                    <div className="item-card__body">
                        <p></p>
                        <p>Username: {userName}</p>
                        <p></p>
                        <p>Email: {email}</p>
                        <p></p>
                    </div>
                </Button>
            )
        }
        return null
    }


    sortResults() {
        let profiles = [...this.props.profile]

        var sortedProfiles: { bio: string; userName: string; email: string; hide: boolean; year: number; major: string; }[];
        sortedProfiles = []

        var email1;
        var username1;
        var email2;
        var username2;
        var searchText;

        if (this.state.searchField.indexOf('@') == -1) {
            searchText = this.state.searchField.toLowerCase();
        } else {
            searchText = this.state.searchField.substring(0, this.state.searchField.indexOf('@')).toLowerCase();
        }

        for (let i = 0; i < profiles.length - 1; i++) {
            for (let j = 0; j < profiles.length - i - 1; j++) {
                email1 = profiles[j].email.substring(0, profiles[j].email.indexOf('@')).toLowerCase();
                username1 = profiles[j].userName.toLowerCase();
                email2 = profiles[j + 1].email.substring(0, profiles[j].email.indexOf('@')).toLowerCase();
                username2 = profiles[j + 1].userName.toLowerCase();

                if ((username2 === searchText || email2 === searchText)
                    || ((username2.includes(searchText) || email2.includes(searchText))
                        && (!username1.includes(searchText) && !email1.includes(searchText)))
                    || ((username2.includes(searchText) && email2.includes(searchText))
                        && (username1.includes(searchText) ? !email1.includes(searchText) : email1.includes(searchText)))) {
                    let hold = profiles[j];
                    profiles[j] = profiles[j + 1];
                    profiles[j + 1] = hold;
                }
            }
        }

        var j = 0
        for (let i = 0; i < profiles.length - 1; i++) {
            email1 = profiles[i].email.substring(0, profiles[i].email.indexOf('@')).toLowerCase();
            username1 = profiles[i].userName.toLowerCase();

            if (searchText != '' && (username1.includes(searchText) || email1.includes(searchText))) {
                sortedProfiles[j] = profiles[i];

                j = j + 1;
                this.setState({
                    profileFound: true
                })
            }
        }

        this.setState({
            sortedProfiles: sortedProfiles
        })
    }



    handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            searchField: e.target.value
        })
    }

    handleSubmit(event: any) {
        event.preventDefault();
        this.setState({
            searchStarted: true,
            profileSelected: false,
            profileFound: false
        })
        this.sortResults()
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
                        {this.props.profile != undefined && this.props.profile.length != 0 && this.state.searchStarted && !this.state.profileSelected && this.state.profileFound
                            ?
                            this.state.sortedProfiles.map((users) => this.getUser(users.year, users.userName, users.hide, users.email, users.bio, users.major))
                            :
                            this.displayUserProfile(this.state.displayProfile.bio, this.state.displayProfile.userName, this.state.displayProfile.major, this.state.displayProfile.year)
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