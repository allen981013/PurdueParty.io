import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, Card, CardContent, Typography, } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';


// Interface/type for Profile State
interface ProfileMessagesState {
    checked: number[],
    messageToBuyer: string
}

// Interface/type for Profile Props
interface ProfileMessagesProps {
    currentUser: string,
    auth: any,
    firebase: any,
    users: any,
    sellListings: any
}

class ProfileMessages extends Component<ProfileMessagesProps, ProfileMessagesState> {
    constructor(props: ProfileMessagesProps) {
        super(props);
        this.state = {
            checked: [],
            messageToBuyer: ""
        }
    }

    handleToggle = (messageObj: number) => {
        const currentIndex = this.state.checked.indexOf(messageObj);
        const newChecked = [...this.state.checked];

        if (currentIndex === -1) {
            newChecked.push(messageObj);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked
        })
    }

    handleReplyClick = (event: React.MouseEvent<HTMLElement>) => {

    }

    handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            messageToBuyer: e.target.value,
        })
    }
    handleSubmitMessage = () => {
        const { auth } = this.props;

        if (this.state.messageToBuyer.length < 4) {
            window.alert("Your message must be at least 4 characters")
        } else {
            //this.props.messageListingOwner(auth.uid, this.props.marketplace[0].owner, this.props.match.params.itemID, this.state.messageToOwner)
        }
        this.setState({
            messageToBuyer: ""
        })
    }

    render() {
        var authUserInfo: any
        var index

        if (this.props.users != undefined) {
            var index = this.props.users.findIndex((element: any) => element.userName === this.props.currentUser)
            if (index != -1) {
                authUserInfo = this.props.users[index]
            } else {
                authUserInfo = undefined
            }
        } else {
            authUserInfo = undefined
        }

        if (authUserInfo == undefined || this.props.sellListings == undefined) {
            return (
                <div>
                    <p></p>
                    You have no marketplace messages.
                </div>
            )
        }
        const boldText = {
            fontWeight: 'bold' as 'bold'
        }
        return (
            <div>
                <p>
                    Marketplace Messages
                </p>
                <List sx={{ width: '100%', maxWidth: 720, bgcolor: 'background.paper' }}>
                    {
                        authUserInfo.marketMessages.map((messageObj: any) => {
                            const labelId = `checkbox-list-label-${messageObj.listingID}-${messageObj.senderID}`;
                            var listingInfo
                            var senderInfo
                            var index = this.props.sellListings.findIndex((element: any) => element.id === messageObj.listingID)

                            if (index != -1) {
                                listingInfo = this.props.sellListings[index]
                            } else {
                                listingInfo = {
                                    title: "",
                                    description: ""
                                }
                            }

                            var index = this.props.users.findIndex((element: any) => element.id === messageObj.senderID)
                            if (index != -1) {
                                senderInfo = this.props.users[index]
                            } else {
                                senderInfo = {
                                    userName: "",
                                }
                            }
                            var messageField = <div></div>
                            if (true) {
                                messageField = <div id={labelId + "messageField"}>
                                    <input type="text" value={this.state.messageToBuyer} placeholder="Enter your response" id={labelId + "replyField"}
                                        onChange={this.handleChangeMessage} />
                                    <div></div>
                                    <Button
                                        onClick={this.handleSubmitMessage}
                                        sx={{
                                            textTransform: "none", color: "#787c7e", fontWeight: "bold",
                                            fontSize: "12px", padding: "4px 4px"
                                        }}
                                        id={labelId + "replyButton"}
                                    >
                                        Submit
                                    </Button>
                                </div>;
                            }

                            return (
                                <div>
                                    <ListItem
                                        key={messageObj.listingID + messageObj.senderID}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="comments" onClick={(event) => this.handleReplyClick(event)}>
                                                <CommentIcon />
                                            </IconButton>
                                        }
                                        divider={true}
                                        disablePadding
                                    >
                                        <ListItemButton role={undefined} onClick={() => this.handleToggle(messageObj)} dense>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={this.state.checked.indexOf(messageObj) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                id={labelId}
                                                primary={'Sell listing: ' + listingInfo.title}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {'From: ' + senderInfo.userName}
                                                        </Typography>
                                                        {' — ' + messageObj.message}
                                                    </React.Fragment>
                                                }
                                            />
                                            {/* 'Listing description: ' + listingInfo.description */}


                                        </ListItemButton>

                                    </ListItem>

                                    {messageField}
                                </div>
                            );
                        })
                    }
                </List>
            </div>

        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        auth: state.firebase.auth,
        currentUser: state.auth.lastCheckedUsername,
        users: state.firestore.ordered.users,
        sellListings: state.firestore.ordered.sellListings
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
    }
}

export default compose<React.ComponentType<ProfileMessages>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
        { collection: 'sellListings' }
    ])
)(ProfileMessages)