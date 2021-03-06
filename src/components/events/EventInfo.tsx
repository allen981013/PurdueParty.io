import { Box, Button, Grid, Chip, CircularProgress, IconButton, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firebaseConnect, firestoreConnect } from 'react-redux-firebase';
import { EditOutlined, DeleteOutlined } from '@mui/icons-material'
import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { firebaseStorageRef } from '../..'
import { AppDispatch, RootState } from '../../store'
import { EventInfoStatesRedux, fetchEventInfo } from './EventInfoSlice'
import { deleteEvent, removeRSVPEvent, removeSaveEvent, rsvpEvent, saveEvent } from '../../store/actions/eventActions'
import { PageVisitInfo, updatePageVisitInfo } from '../tutorial/TutorialSlice';
import { toast } from 'react-toastify';
import { EVENTINFO_TUTORIAL_1, EVENTINFO_TUTORIAL_2, EVENTINFO_TUTORIAL_3} from '../tutorial/Constants'

interface EventInfoProps {
  eventID: string;
  // The following props will be passed by redux
  hasInfoFetched: boolean,
  eventNotFound: boolean,
  event: EventInfoStatesRedux["event"],
  host: EventInfoStatesRedux["host"],
  auth: any,
  match: any,
  users: {
    bio: string,
    savedEvents: string[],
    userName: string
  }[],
  pageVisitInfo: PageVisitInfo;
  updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => void;
  fetchEventInfo: (eventID: string) => void,
  deleteEvent: (eventID: string) => void,
  rsvpEvent: (eventID: string) => void,
  removeRSVPEvent: (eventID: string) => void,
  saveEvent: (eventID: string) => void,
  removeSaveEvent: (eventID: string) => void,
}

interface EventInfoStates {
  deleteEventError: boolean,
}

class EventInfo extends React.Component<EventInfoProps, EventInfoStates> {

  isTutorialRendered = false

  constructor(props: EventInfoProps) {
    super(props)

    this.state = {
      deleteEventError: true,
    };
  }

  getChips(texts: string[]) {
    return (
      <Box display="flex" alignSelf="flex-start">
        {
          texts.map((text) =>
            <Chip
              label={text}
              variant="outlined"
              sx={{ marginRight: "8px", backgroundColor: "white" }}
            />
          )
        }
      </Box>
    )
  }

  handleDelete = (event: any) => {
    event.preventDefault();
    var result: boolean = window.confirm("Are you sure you want to delete your event?");
    if (result) {
      console.log("DELETING EVENT")
      this.props.deleteEvent(this.props.eventID);
      if (!this.state.deleteEventError) {
        // Alert the user
        window.alert("Listing Deleted Successfully!");
        // Redirect them to another page
        //window.location.href = "./";
      }
    }
    // User said no, do nothing
  }

  handleRSVP = (event: any) => {
    event.preventDefault();
    console.log("RSVP TO EVENT");
    this.props.rsvpEvent(this.props.eventID);
    //window.location.reload();
  }

  handleRemoveRSVP = (event: any) => {
    event.preventDefault();
    console.log("RSVP TO EVENT");
    this.props.removeRSVPEvent(this.props.eventID);
    //window.location.reload();
  }

  handleSave = (event: any) => {
    event.preventDefault();
    console.log("SAVE EVENT");
    this.props.saveEvent(this.props.eventID);
    //window.location.reload();
  }

  handleRemoveSave = (event: any) => {
    event.preventDefault();
    console.log("REMOVE EVENT FROM SAVED");
    this.props.removeSaveEvent(this.props.eventID);
    //window.location.reload();
  }

  componentDidMount() {
    this.props.fetchEventInfo(this.props.eventID)
  }

  showUser = (user: any) => {
    if (this.props.users) {
      return user.id === this.props.auth.uid
    } else {
      return false;
    }
  }

  render() {
    const { auth } = this.props;
    console.log(this.props);
    if (!auth.uid) return <Redirect to='/signin' />
    if (this.props.pageVisitInfo 
      && !this.props.pageVisitInfo.eventInfoPage
      && !this.isTutorialRendered
      ) {
      toast.info(EVENTINFO_TUTORIAL_1)
      toast.info(EVENTINFO_TUTORIAL_2)
      toast.info(EVENTINFO_TUTORIAL_3)
      let newPageVisitInfo: PageVisitInfo = {
        ...this.props.pageVisitInfo,
        eventInfoPage: true,
      }
      this.props.updatePageVisitInfo(newPageVisitInfo)
      this.isTutorialRendered = true
    }
    if (!this.props.hasInfoFetched)
      return (
        <Box pt="32px"><CircularProgress /></Box>
      )
    if (this.props.eventNotFound)
      return (
        <Box pt="32px">Event not found</Box>
      )
    var rsvpCode: any = <div></div>;
    if (this.props.event.attendees.indexOf(auth.uid) < 0) {
      rsvpCode = <Button
        // variant="outlined"
        sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%", backgroundColor: "white" }}
        onClick={this.handleRSVP}
      >
        RSVP
      </Button>
    }
    else {
      rsvpCode = <Button
        // variant="outlined"
        sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%" }}
        onClick={this.handleRemoveRSVP}
      >
        Remove RSVP
      </Button>
    }
    var saveCode: any = <div></div>;
    var curUser: any = undefined;
    console.log(this.props.eventID);
    if (this.props.users) {
      curUser = this.props.users.find(this.showUser);
    }
    console.log(curUser);
    if (curUser == null || curUser.savedEvents == null || !curUser.savedEvents.includes(this.props.eventID)){
      saveCode = <Button 
      // variant="outlined"
      sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%"}}
      onClick={this.handleSave}
      >
    Save
    </Button>
    }
    else {
      saveCode = <Button 
      // variant="outlined"
      sx={{ color: "black", border: "1px solid black", marginRight: "20%", marginTop: "2%"}}
      onClick={this.handleRemoveSave}
      >
      Remove From Saved
      </Button>
    }
    return (
      <Box
        display="flex"
        alignSelf="center"
        flexDirection="column"
        alignItems="center"
        pt="8px"
        padding="56px 16px"
        maxWidth="1200px"
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
            <img width="100%" height="100%" src={this.props.event.imageUrl} />
          </Grid>
          <Grid
            item
            id="details-container"
            xs={12}
            md={6}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              pl="16px"
            >
              <Box
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                width="100%"
                pb="32px"
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 300, margin: "0px", flexGrow: 1, textAlign: "left", wordWrap: "break-word", minWidth: "1%" }}
                >
                  {this.props.event.title}
                </Typography>

                {this.props.event.editors.includes(this.props.auth.uid) &&
                  <IconButton
                    component={Link}
                    to={"/edit-event/" + this.props.eventID}
                    // variant="outlined"
                    sx={{ color: "black", height: "32px", width: "32px", margin: "0px", backgroundColor: "white" }}
                  >
                    <EditOutlined sx={{ fontSize: "16px" }} />
                    {/* Edit */}
                  </IconButton>}
                {this.props.event.ownerID === this.props.auth.uid &&
                  <IconButton
                    // variant="outlined"
                    sx={{ color: "black", height: "32px", width: "32px", backgroundColor: "white" }}
                    onClick={this.handleDelete}
                  >
                    <DeleteOutlined sx={{ fontSize: "16px" }} />
                    {/* Delete  */}
                  </IconButton>
                }
                {!this.state.deleteEventError ? <Redirect to='/events' /> : <div></div>}
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                pb="24px"
              >
                <strong style={{ paddingBottom: "8px" }}>Date and Time</strong>
                <span style={{ paddingBottom: "4px" }}>{this.props.event.startTime} to</span>
                <span style={{ paddingBottom: "4px" }}>{this.props.event.endTime}</span>
                <span style={{ paddingBottom: "4px" }}>({this.props.event.duration})</span>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                textAlign="left"
                pb="24px"
                width="100%"
                sx={{ wordWrap: "break-word", minWidth: "1%" }}
              >
                <strong>Location</strong>
                {/* <Box
                  sx={{ wordWrap: "break-word", minWidth: "1%", paddingTop: "8px", width: "100%" }}
                > */}
                <Box pt="8px" width="100%" sx={{ wordWrap: "break-word", maxWidth: { xs: "90vw", md: "500px", lg: "550px" } }}>
                  {this.props.event.location}
                </Box>
              </Box>
              {rsvpCode}
              {saveCode}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                pb="24px"
              >
              </Box>
            </Box>
          </Grid>
        </Grid>
        <hr style={{ width: "100%", border: "1px solid lightgrey", margin: "40px 0px 28px" }} />
        <h1 style={{ fontWeight: 300, margin: "0px 0px 16px", alignSelf: "flex-start" }}>Description</h1>
        <Box
          display="block"
          alignSelf="flex-start"
          flexWrap="nowrap"
          width="100%"
          maxWidth="95vw"
          sx={{ textAlign: "left", wordWrap: "break-word", overflowWrap: "break-word" }}
        >
          {this.props.event.description}
        </Box>
        {
          this.props.event.perks.length &&
          <h1 style={{ fontWeight: 300, margin: "24px 0px 16px", alignSelf: "flex-start" }}>Perks</h1>
        }
        {
          this.props.event.perks.length && this.getChips(this.props.event.perks)
        }
        <h1 style={{ fontWeight: 300, margin: "24px 0px 16px", alignSelf: "flex-start" }}>Categories</h1>
        {this.getChips(this.props.event.categories)}
        <hr style={{ width: "100%", border: "1px solid lightgrey", margin: "40px 0px 28px" }} />
        <h1 style={{ fontWeight: 300, margin: "0px 0px 16px", alignSelf: "flex-start" }}>Host</h1>
        <Button
          component={Link}
          to={this.props.host.href}
          sx={{
            width: "100%", maxWidth: "95vw", height: "92px", color: "black", boxShadow: 3,
            justifyContent: "flex-start", paddingLeft: "24px", backgroundColor: "white"
          }}
        >
          <h2 style={{ fontWeight: 300, textTransform: "none" }}>{this.props.host.name}</h2>
        </Button>
      </Box >
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    hasInfoFetched: state.eventInfo.hasInfoFetched,
    eventNotFound: state.eventInfo.eventNotFound,
    event: state.eventInfo.event,
    host: state.eventInfo.host,
    auth: state.firebase.auth,
    users: state.firestore.ordered.users,
    pageVisitInfo: state.tutorial.pageVisitInfo,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    fetchEventInfo: (eventID: string) => dispatch(fetchEventInfo(eventID)),
    deleteEvent: (eventID: string) => dispatch(deleteEvent(eventID)),
    rsvpEvent: (eventID: string) => dispatch(rsvpEvent(eventID)),
    removeRSVPEvent: (eventID: string) => dispatch(removeRSVPEvent(eventID)),
    updatePageVisitInfo: (newPageVisitInfo: PageVisitInfo) => dispatch(updatePageVisitInfo(newPageVisitInfo)),
    saveEvent: (eventID: string) => dispatch(saveEvent(eventID)),
    removeSaveEvent: (eventID: string) => dispatch(removeSaveEvent(eventID)),
  }
}

export default compose<React.ComponentType<EventInfoProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
      {
        collection: 'users'
      }
    ])
)(EventInfo)
//export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);