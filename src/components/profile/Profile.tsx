import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, Card, CardContent, Typography, Stack } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { toast } from 'react-toastify';
import { PROFILE_TUTORIAL_1, PROFILE_TUTORIAL_2, PROFILE_TUTORIAL_3} from '../tutorial/Constants'
import Theme from "../../Theme"

// Interface/type for Profile State
interface ProfileState {
}

// Interface/type for Profile Props
interface ProfileProps {
    profile: {
        bio: string,
        userName: string,
        major: string,
        year: number,
        email: string,
        image: string
    },
    currentUser: string;
    auth: any;
    firebase: any;
    pageVisitInfo: PageVisitInfo;
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => void;
}

class Profile extends Component<ProfileProps, ProfileState> {
  
    isTutorialRendered = false

    constructor(props: ProfileProps) {
        super(props);
        this.state = {
        }
    }

    getProfile() {
        var profile = this.props.profile
        return (
            <Box
                display="flex"
                alignSelf="center"
                flexDirection="column"
                alignItems="center"
                pt="8px"
                maxWidth="1200px"
                margin="56px 16px"
            >
                <Grid
                    container
                    id="top-page-container"
                    spacing={2}
                    sx={{ minWidth: { md: "900px" } }}
                >
                    <Grid
                        item
                        id="image-container"
                        xs={12}
                        md={6}
                    >
                        {profile.image != undefined ? <img width="100%" height="100%" src={profile.image} /> : "No profile image found."}
                    </Grid>

                    <Grid
                        item
                        id="details-container"
                        xs={12}
                        md={6}
                    >
                        <Box
                            id="title-container"
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="flex-start"
                            pl="16px"
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                width="100%"
                                pb="32px"
                            >
                                <h1 style={{ fontWeight: 300, margin: "0px" }}>{profile.userName}</h1>


                            </Box>

                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                pb="24px"
                            >
                                <strong style={{ paddingBottom: "8px" }}>Email</strong>
                                <span>{profile.email}</span>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                pb="24px"
                            >
                                <strong style={{ paddingBottom: "8px" }}>Year</strong>
                                <span style={{ paddingBottom: "4px" }}>{(profile.year == undefined ? "Navigate to 'Edit Profile' to set your graduation year." : profile.year)}</span>
                            </Box>

                        </Box>
                    </Grid>
                </Grid>

                <hr style={{ width: "100%", border: "1px solid lightgrey", margin: "40px 0px 28px" }} />
                <h1 style={{ fontWeight: 300, margin: "0px 0px 16px", alignSelf: "flex-start" }}>Profile Bio</h1>
                <Box alignSelf="flex-start">{(profile.bio === "" || profile.bio == undefined ? "Navigate to 'Edit Profile' to create your bio." : profile.bio)}</Box>

                <h1 style={{ fontWeight: 300, margin: "24px 0px 16px", alignSelf: "flex-start" }}>Major</h1>
                <Box alignSelf="flex-start">{(profile.major === "" || profile.major == undefined ? "Navigate to 'Edit Profile' to set your major." : profile.major)}</Box>

                <hr style={{ width: "100%", border: "1px solid lightgrey", margin: "40px 0px 28px" }} />
                <h1 style={{ fontWeight: 300, margin: "24px 0px 16px", alignSelf: "flex-start" }}>Links to other pages</h1>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            component={Link}
                            to="profile-messages"
                            variant="outlined"
                            sx={{ color: "black", border: "1px solid black", backgroundColor: "white" }}
                        > Marketplace Messages
                        </Button>

                        <Button
                            component={Link}
                            to="search-profiles"
                            variant="outlined"
                            sx={{ color: "black", border: "1px solid black", backgroundColor: "white" }}
                        > Search For Other Profiles
                        </Button>

                        <Button
                            component={Link}
                            to="edit-profile"
                            variant="outlined"
                            sx={{ color: "black", border: "1px solid black", backgroundColor: "white" }}
                        > Edit Profile
                        </Button>
                    </Stack>
                </div>
            </Box>
        )
    }

    render() {
        const { auth } = this.props;

        if (!auth.uid) return <Redirect to='/signin' />
        
        if (this.props.pageVisitInfo 
          && !this.props.pageVisitInfo.profilePage
          && !this.isTutorialRendered
          ) {
          toast.info(PROFILE_TUTORIAL_1)
          toast.info(PROFILE_TUTORIAL_2)
          toast.info(PROFILE_TUTORIAL_3)
          let newPageVisitInfo: PageVisitInfo = {
            ...this.props.pageVisitInfo,
            profilePage: true,
          }
          this.props.updatePageVisitInfo(newPageVisitInfo)
          this.isTutorialRendered = true
        }

        return (
            <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {this.props.profile != undefined ?
                        <Box>
                            {this.getProfile()}
                            <Theme/>
                        </Box>
                        :
                        <div></div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        profile: state.firestore.ordered.authUserInfo !== undefined ? state.firestore.ordered.authUserInfo[0] : undefined,
        auth: state.firebase.auth,
        currentUser: state.auth.lastCheckedUsername,
        pageVisitInfo: state.tutorial.pageVisitInfo,
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
    }
}

export default compose<React.ComponentType<Profile>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props: ProfileProps) => {
        return [
            {
                collection: "users",
                where: [
                    ["userName", "==", props.currentUser],
                ],
                storeAs: "authUserInfo",
                limit: 1,
            }
        ]
    })
)(Profile)