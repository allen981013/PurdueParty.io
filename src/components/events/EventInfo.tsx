import { Box, Button, Grid, Chip, CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import { EditOutlined } from '@mui/icons-material'
import React from 'react'
import { connect } from 'react-redux'
import { firebaseStorageRef } from '../..'
import { AppDispatch, RootState } from '../../store'
import { EventInfoStatesRedux, fetchEventInfo } from './EventInfoSlice'


interface EventInfoProps {
  eventID: string;
  // The following props will be passed by redux
  hasInfoFetched: boolean;
  eventNotFound: boolean;
  event: EventInfoStatesRedux["event"];
  host: EventInfoStatesRedux["host"];
  fetchEventInfo: (eventID: string) => void;
}

interface EventInfoStates {

}

class EventInfo extends React.Component<EventInfoProps, EventInfoStates> {

  constructor(props: EventInfoProps) {
    super(props)
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

  componentDidMount() {
    this.props.fetchEventInfo(this.props.eventID)
  }

  render() {
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
        maxWidth="1200px"
        padding="56px 16px"
      >
        <Grid
          container
          id="top-page-container"
          spacing={2}
        // sx={{ margin: "0px" }}
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
                <h1 style={{ fontWeight: 300, margin: "0px" }}>{this.props.event.title}</h1>
                <Button sx={{ color: "black", height: "32px" }}>
                  <EditOutlined sx={{ fontSize: "16px", paddingRight: "4px" }} />
                  Edit
                </Button>
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
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                pb="24px"
              >
                <strong style={{ paddingBottom: "8px" }}>Location</strong>
                <span>{this.props.event.location}</span>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                pb="24px"
              >
                {/* <strong style={{ paddingBottom: "8px" }}>Description</strong>
                <span>{this.props.event.description}</span> */}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <hr style={{ width: "100%", border: "1px solid lightgrey", margin: "40px 0px 28px" }} />
        <h1 style={{ fontWeight: 300, margin: "0px 0px 16px", alignSelf: "flex-start" }}>Description</h1>
        <Box alignSelf="flex-start">{this.props.event.description}</Box>
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
            width: "100%", height: "92px", color: "black", boxShadow: 3,
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
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    fetchEventInfo: (eventID: string) => dispatch(fetchEventInfo(eventID))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);