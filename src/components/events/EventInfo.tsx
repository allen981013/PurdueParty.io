import { Box, Button, Grid, Chip, CircularProgress, IconButton, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@mui/icons-material'
import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { firebaseStorageRef } from '../..'
import { AppDispatch, RootState } from '../../store'
import { EventInfoStatesRedux, fetchEventInfo } from './EventInfoSlice'
import { deleteEvent } from '../../store/actions/eventActions'

interface EventInfoProps {
  eventID: string;
  // The following props will be passed by redux
  hasInfoFetched: boolean,
  eventNotFound: boolean,
  event: EventInfoStatesRedux["event"],
  host: EventInfoStatesRedux["host"],
  auth: any,
  fetchEventInfo: (eventID: string) => void,
  deleteEvent: (eventID: string) => void,
}

interface EventInfoStates {
  deleteEventError: boolean,
}

class EventInfo extends React.Component<EventInfoProps, EventInfoStates> {

  constructor(props: EventInfoProps) {
    super(props)

    this.state = {
      deleteEventError: true
    };
  }

  getChips(texts: string[]) {
    return (
      <Box display="flex" alignSelf="flex-start">
        {
          texts.map((text) =>
            <Chip
              label={text}
              // color="primary"
              variant="outlined"
              sx={{ marginRight: "8px" }}
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

  componentDidMount() {
    this.props.fetchEventInfo(this.props.eventID)
  }

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />
    if (!this.props.hasInfoFetched)
      return (
        <Box pt="32px"><CircularProgress /></Box>
      )
    if (this.props.eventNotFound)
      return (
        <Box pt="32px">Event not found</Box>
      )
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
                    sx={{ color: "black", height: "32px", width: "32px", margin: "0px" }}
                  >
                    <EditOutlined sx={{ fontSize: "16px" }} />
                    {/* Edit */}
                  </IconButton>}
                {this.props.event.ownerID === this.props.auth.uid &&
                  <IconButton
                    // variant="outlined"
                    sx={{ color: "black", height: "32px", width: "32px" }}
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
            justifyContent: "flex-start", paddingLeft: "24px"
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
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    fetchEventInfo: (eventID: string) => dispatch(fetchEventInfo(eventID)),
    deleteEvent: (eventID: string) => dispatch(deleteEvent(eventID))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);