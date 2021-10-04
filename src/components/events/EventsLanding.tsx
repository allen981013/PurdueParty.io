import { Box, Button, CircularProgress, Grid } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { EventsLandingStatesRedux, fetchEventsAtNextPage } from './EventsLandingSlice'

interface EventsLandingProps {
  events: EventsLandingStatesRedux["events"];
  isEventsFetched: boolean;
  isLastPage: boolean;
  fetchEventsAtNextPage: () => void;
}

interface EventsLandingStates {
}


class EventsLanding extends React.Component<EventsLandingProps, EventsLandingStates> {

  constructor(props: EventsLandingProps) {
    super(props)

  }

  componentDidMount() {
    console.log("")
  }

  getCards(events: any[]) {
    return <Grid
      item
      id="image-container"
      xs={12}
      md={6}
    >
    </Grid>
  }

  handleLoadMoreClick = (e: any) => {
    this.props.fetchEventsAtNextPage()
  }

  render() {
    return (
      <Box
        display="flex"
        alignSelf="center"
        flexDirection="column"
        alignItems="center"
        pt="8px"
        width="100%"
        maxWidth="1200px"
        padding="48px 16px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
        >
          <h1 style={{ fontWeight: 300, margin: "0px" }}>Events</h1>
          <Button
            component={Link}
            to="events/create/"
            variant="outlined"
            sx={{ color: "black", border: "1px solid black" }}
          > Create
          </Button>
        </Box>
        {!this.props.isEventsFetched  && <CircularProgress/>}
        {this.props.isEventsFetched && this.props.events.length == 0 && <div>No events found</div>}
        {
          this.props.events.length != 0 &&
          <Grid
            container
            id="top-page-container"
            spacing={2}
          >
            {this.getCards([])}
          </Grid>
        }
        {
          this.props.events.length != 0 && !this.props.isLastPage &&
          <Button
            variant="outlined"
            sx={{ color: "black", border: "1px solid black" }}
            onClick={this.handleLoadMoreClick}
          >
            Load more
          </Button>
        }
      </Box>
    )
  }

}


const mapStateToProps = ((state: RootState) => {
  return {
    events: state.eventsLanding.events,
    isEventsFetched: state.eventsLanding.isEventsFetched,
    isLastPage: state.eventsLanding.isLastPage,
  }
})

const mapDispatchToProps = ((dispatch: AppDispatch) => {
  return {
    fetchEventsAtNextPage: () => dispatch(fetchEventsAtNextPage()),
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EventsLanding)

