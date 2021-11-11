import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { replyListingMessage, deleteMarketMessages } from '../../store/actions/profileActions';
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

import DeleteIcon from '@mui/icons-material/Delete';


// Interface/type for Profile State
interface ProfileMessagesState {
    checked: any[],
    messageToBuyer: string,
    messageToReply: any
}

// Interface/type for Profile Props
interface ProfileMessagesProps {
    currentUser: string,
    auth: any,
    firebase: any,
    users: any,
    sellListings: any,
    deleteMarketMessages: (marketMessage: any, userID: string) => void,
    replyListingMessage: (marketMessage: any, userID: string, newMessage: string) => void
}

class ProfileMessages extends Component<ProfileMessagesProps, ProfileMessagesState> {
    constructor(props: ProfileMessagesProps) {
        super(props);
        this.state = {
            checked: [],
            messageToBuyer: "",
            messageToReply: null
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

    handleReplyClick = (messageObj: any) => {
        if(messageObj.closed){
            window.alert("This message thread is closed, the listing owner has responded to your message.")
            return
        }
        if (messageObj == this.state.messageToReply) {
            this.setState({
                messageToReply: null
            })
        } else {
            this.setState({
                messageToReply: messageObj
            })
        }
    }

    handleDeleteClick = () => {
        let newChecked = this.state.checked
        const {auth} = this.props
        if (newChecked.length < 1) {
            window.alert("Please select the messages you would like to delete.")
            return
        }

        var answer = window.confirm("Are you sure you want to delete these messages?");
        if (answer) {
            this.props.deleteMarketMessages(newChecked, auth.uid)

            this.setState({
                checked: []
            })
        }
    }

    handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            messageToBuyer: e.target.value,
        })
    }
    handleSubmitMessage = (messageObj: any) => {
        const { auth } = this.props;

        if (this.state.messageToBuyer.length < 4) {
            window.alert("Your message must be at least 4 characters")
        } else {
            this.props.replyListingMessage(messageObj, auth.uid, this.state.messageToBuyer)
            this.setState({
                messageToBuyer: "",
                messageToReply: null
            })
        }
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

        if (authUserInfo == undefined || this.props.sellListings == undefined || authUserInfo.marketMessages == undefined || authUserInfo.marketMessages.length < 1) {
            return (
                <div>
                    <p></p>
                    <p>
                    You have no marketplace messages.
                    </p>
                </div>
            )
        }
        const boldText = {
            fontWeight: 'bold' as 'bold'
        }
        return (
            <div>
                <p></p>
                <p>
                    Marketplace Messages
                </p>
                <p></p>
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
                            if (this.state.messageToReply == messageObj && !messageObj.closed) {
                                messageField = <div id={labelId + "messageField"}>
                                    <input type="text" value={this.state.messageToBuyer} placeholder="Enter your response" id={labelId + "replyField"}
                                        onChange={this.handleChangeMessage} />
                                    <div></div>
                                    <Button
                                        onClick={() => this.handleSubmitMessage(messageObj)}
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
                                            <IconButton edge="end" aria-label="comments" onClick={() => this.handleReplyClick(messageObj)}>
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
                <IconButton edge="end" aria-label="delete" onClick={() => this.handleDeleteClick()}>
                    <DeleteIcon />
                </IconButton>

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
        deleteMarketMessages: (marketMessage: any, userID: string) => dispatch(deleteMarketMessages(marketMessage, userID)),
        replyListingMessage: (marketMessage: any, userID: string, newMessage: string) => dispatch(replyListingMessage(marketMessage, userID, newMessage))
    }
}

export default compose<React.ComponentType<ProfileMessages>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
        { collection: 'sellListings' }
    ])
)(ProfileMessages)