import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { EventsLandingStatesRedux, fetchEvents } from './EventsLandingSlice'

interface EventsLandingProps {
  events: EventsLandingStatesRedux["events"];
  isEventsFetched: boolean;
  isLastPage: boolean;
  fetchEvents: (furthestPage: number) => void;
}

interface EventsLandingStates {
}


class EventsLanding extends React.Component<EventsLandingProps, EventsLandingStates> {
  furthestPage = 1

  constructor(props: EventsLandingProps) {
    super(props)
  }

  componentDidMount() {
    console.log("")
    this.props.fetchEvents(this.furthestPage)
  }

  getCards(events: EventsLandingStatesRedux['events']) {
    return events.map((event) =>
      <Grid
        item
        id="image-container"
        xs={12}
        md={3}
      >
        <Card>
          <CardActionArea component={Link} to={event.href}>
            <CardMedia
              component="img"
              height="140"
              image={event.imageUrl}
            />
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography gutterBottom noWrap component="div">
                {event.title}
              </Typography>
              <Typography noWrap variant="body2" color="text.secondary" component="div">
                {event.startTime}
              </Typography>
              <Typography noWrap variant="body2" color="text.secondary" component="div">
                {event.location}
              </Typography>
            </CardContent>
            <Box display="flex" padding="4px 8px 4px 16px" sx={{ background: "lightgrey" }}>
              <Typography noWrap variant="body2" color="text.secondary" component="div">
                {event.hostName}
              </Typography>
            </Box>
          </CardActionArea>
        </Card>

      </Grid>)
  }

  handleLoadMoreClick = (e: any) => {
    this.furthestPage += 1
    this.props.fetchEvents(this.furthestPage)
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
          pb="16px"
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
        {!this.props.isEventsFetched && <CircularProgress />}
        {this.props.isEventsFetched && this.props.events.length == 0 && <div>No events found</div>}
        {
          this.props.events.length != 0 &&
          <Grid
            container
            id="top-page-container"
            spacing={2}
          >
            {this.getCards(this.props.events)}
          </Grid>
        }
        {
          this.props.events.length != 0 && !this.props.isLastPage &&
          <Button
            variant="outlined"
            sx={{ color: "black", border: "1px solid black", margin: "32px 0px" }}
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
    fetchEvents: (furthestPage: number) => dispatch(fetchEvents(furthestPage)),
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EventsLanding)

