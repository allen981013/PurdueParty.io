import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography
} from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { EventsLandingStatesRedux, fetchEvents, FilterParameter } from './EventsLandingSlice'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Redirect } from 'react-router-dom';

interface EventsLandingProps {
  events: EventsLandingStatesRedux["events"];
  isEventsFetched: boolean;
  isLastPage: boolean;
  fetchEvents: (furthestPage: number, filterParameter: FilterParameter) => void;
  auth: any
}

interface EventsLandingStates {
}


class EventsLanding extends React.Component<EventsLandingProps, EventsLandingStates> {
  furthestPage = 1
  filterParameter = {
    searchKeyword: "",

  }

  constructor(props: EventsLandingProps) {
    super(props)
  }

  componentDidMount() {
    console.log("")
    this.props.fetchEvents(this.furthestPage, this.filterParameter)
  }

  getCards(events: EventsLandingStatesRedux['events']) {
    return events.map((event) =>
      <Grid
        item
        id="image-container"
        xs={12}
        sm={6}
        md={4}
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

  handleSearchBarChange = (e: any) => {
    this.filterParameter.searchKeyword = e.target.value
  }

  handleSearchBarKeyDown = (e: any) => {
    if (e.key === "Enter") {
      this.props.fetchEvents(this.furthestPage, this.filterParameter)
    }
  }

  handleSearchButtonClick = (e: any) => {
    console.log(this.filterParameter)
    this.props.fetchEvents(this.furthestPage, this.filterParameter)
  }

  handleLoadMoreClick = (e: any) => {
    this.furthestPage += 1
    this.props.fetchEvents(this.furthestPage, this.filterParameter)
  }

  render() {
    const { auth } = this.props;
    if (!auth) return <Redirect to='/signin' />
    return (
      <Box
        display="flex"
        alignSelf="center"
        flexDirection="column"
        alignItems="center"
        pt="8px"
        width="100%"
        maxWidth="1200px"
        padding="48px 32px"
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
            to="/events/create/"
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
            spacing={2}
            padding={"16px 0px"}
          >
            <Grid
              item
              xs={12}
              md={3}
            >
              <Box display="flex" flexDirection="column" width="100%">
                <Paper
                  sx={{ p: '2px 4px 0px 0px ', display: 'flex', alignItems: 'center' }}
                >
                  <InputBase
                    sx={{ ml: 2, flex: 1 }}
                    placeholder="Search events"
                    inputProps={{ 'aria-label': 'search events' }}
                    onChange={this.handleSearchBarChange}
                    onKeyDown={this.handleSearchBarKeyDown}
                  />
                  <IconButton sx={{ p: '10px' }} aria-label="search" onClick={this.handleSearchButtonClick}>
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Box>
            </Grid>
            <Grid
              container
              xs={12}
              md={9}
              spacing={2}
              sx={{ margin: 0, padding: 0 }}
            >
              {this.getCards(this.props.events)}
            </Grid>
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
    fetchEvents: (furthestPage: number, filterParameter: FilterParameter) => dispatch(fetchEvents(furthestPage, filterParameter)),
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EventsLanding)

