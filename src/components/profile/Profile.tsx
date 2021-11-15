import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, Card, CardContent, Typography } from '@mui/material';

// Interface/type for Profile State
interface ProfileState {
}

// Interface/type for Profile Props
interface ProfileProps {
    uid: string,
    profile?: {
        bio: string,
        userName: string,
        major: string,
        year: number
    }[],
    currentUser?: string,
    auth?: any,
    firebase?: any
}

class Profile extends Component<ProfileProps, ProfileState> {

    constructor(props: ProfileProps) {
        super(props);
        this.state = {
        }
    }

    getUser(user: any) {
        if ( this.props.auth.uid != user.id && user.hide) {
            return (
                <Box>
                    This user's profile is private.
                </Box>
            )
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
                                {user.userName}
                            </Typography>
                            <label htmlFor="title">Bio: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {user.bio}
                            </Typography>
                            <label htmlFor="title">Major: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {user.major}
                            </Typography>
                            <label htmlFor="title">Year: </label>
                            <Typography gutterBottom noWrap component="div" marginBottom="10px">
                                {user.year}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )
        }
    }

    checkUser(userName: string) {
        if (userName == this.props.currentUser) {
            return true;
        }
        return false;
    }

    render() {
        const { auth } = this.props;

        if (!auth.uid) return <Redirect to='/signin' />


        return (
            <div>
                {(this.props.auth.uid && this.props.auth.uid == this.props.uid) &&
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                        pb="16px">
                        <h1 style={{ fontWeight: 300, marginLeft: "15%", marginTop: "2%" }}>Welcome Back!</h1>
                    </Box>
                }

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                    <Box id="cropped-purdue-img" />
                    <Grid container className="sections" spacing={2} sx={{ padding: "32px 16px" }}>
                        {this.props.profile != undefined && this.props.profile.length != 0
                            ?
                            this.getUser(this.props.profile[0])
                            :
                            <div>Profile Missing</div>
                        }
                    </Grid>
                </Box>

                <div className="input-field-search">
                    <Button
                        component={Link}
                        to="/search-profiles"
                        variant="outlined"
                        sx={{ color: "black", border: "1px solid black" }}
                    > Search For Other Profiles
                    </Button></div>

                <p></p>

                {(this.props.auth.uid && this.props.auth.uid == this.props.uid) &&
                    <div className="input-field">
                        <Button
                            component={Link}
                            to="/edit-profile"
                            variant="outlined"
                            sx={{ color: "black", border: "1px solid black" }}
                        > Edit Profile
                        </Button></div>
                }

            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        profile: state.firestore.ordered.profileUsers,
        auth: state.firebase.auth,
        currentUser: state.auth.lastCheckedUsername
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
    }
}

export default compose<React.ComponentType<ProfileProps>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props: ProfileProps) => {
        return [
            {
                collection: 'users',
                doc: props.uid, storeAs: "profileUsers"
            }
        ]
    })
)(Profile)