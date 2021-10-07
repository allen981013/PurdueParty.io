import './EventsLanding.css'
import {
  Box, Button, CircularProgress, Grid, Card, CardActionArea,
  CardMedia, CardContent, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { EventsLandingStatesRedux, fetchEvents } from './EventsLandingSlice'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Datetime from 'react-datetime'

import "react-datetime/css/react-datetime.css";
import moment from 'moment'


interface EventsLandingProps {
  events: EventsLandingStatesRedux["events"];
  isEventsFetched: boolean;
  isLastPage: boolean;
  fetchEvents: (fetchParameter: EventsFetchParameter) => void;
}

interface EventsLandingStates {
  startTime: Date;
  startDayRadioValue: string;
}

const DATE_FILTERING_OPTIONS = {
  tomorrow: "tomorrow",
  thisWeekend: "weekend",
  startingAfter: "starting-after",
}

// type for filter parameter
export interface EventsFetchParameter {
  furthestPage: number;
  searchKeyword: string;
  startTimeLowerBound: Date;
  startTimeUpperBound?: Date;
}


class EventsLanding extends React.Component<EventsLandingProps, EventsLandingStates> {

  fetchParameter: EventsFetchParameter = {
    furthestPage: 1,
    searchKeyword: "",
    startTimeLowerBound: new Date(),
    startTimeUpperBound: undefined
  }

  constructor(props: EventsLandingProps) {
    super(props)
    this.state = {
      startTime: new Date(),
      startDayRadioValue: ""
    }
  }

  componentDidMount() {
    this.props.fetchEvents(this.fetchParameter)
  }

  // TODO: Uncomment this if we were to implement full text search
  // handleSearchBarChange = (e: any) => {
  //   this.fetchParameter.searchKeyword = e.target.value
  // }

  // handleSearchBarKeyDown = (e: any) => {
  //   if (e.key === "Enter") {
  //     this.props.fetchEvents(this.fetchParameter)
  //   }
  // }

  // handleSearchButtonClick = (e: any) => {
  //   this.props.fetchEvents(this.fetchParameter)
  // }

  handleLoadMoreClick = (e: any) => {
    this.fetchParameter.furthestPage += 1
    this.props.fetchEvents(this.fetchParameter)
  }

  handleStartTimeChange = (e: any) => {
    this.setState({ startTime: e.toDate(), startDayRadioValue: DATE_FILTERING_OPTIONS.startingAfter })
    this.fetchParameter.startTimeLowerBound = e.toDate()
    this.props.fetchEvents(this.fetchParameter)
  }

  handleStartDayRadioValueChange = (e: any) => {
    var selection = e.target.value
    this.setState({ startDayRadioValue: e.target.value })
    if (selection == DATE_FILTERING_OPTIONS.tomorrow) {
      this.fetchParameter.startTimeLowerBound = moment().add(1, "day").toDate()
      this.fetchParameter.startTimeLowerBound.setHours(0, 0, 0, 0)
      this.fetchParameter.startTimeUpperBound = moment().add(2, "day").toDate()
      this.fetchParameter.startTimeUpperBound.setHours(0, 0, 0, 0)
    } else if (selection == DATE_FILTERING_OPTIONS.thisWeekend) {
      let saturdayInThisWeek = moment().day(6).toDate()
      saturdayInThisWeek.setHours(0, 0, 0, 0)
      let today = new Date()
      let weekendDay = saturdayInThisWeek > today ? saturdayInThisWeek : today
      this.fetchParameter.startTimeLowerBound = weekendDay
      // approximate this weekend to still have 2 days
      this.fetchParameter.startTimeUpperBound = moment(weekendDay).add(2, "days").toDate()
    } else if (selection == DATE_FILTERING_OPTIONS.startingAfter) {
      let today = new Date()
      this.fetchParameter.startTimeLowerBound = this.state.startTime > today ? this.state.startTime : today
      this.fetchParameter.startTimeUpperBound = undefined
    }
    this.props.fetchEvents(this.fetchParameter)
  }

  handleResetFiltersClick = (e: any) => {
    this.setState({ startDayRadioValue: "" })
    this.fetchParameter.startTimeLowerBound = new Date()
    this.fetchParameter.startTimeUpperBound = undefined
    this.props.fetchEvents(this.fetchParameter)
  }

  getCards(events: EventsLandingStatesRedux['events']) {
    return events.map((event) =>
      <Grid
        item
        id="image-container"
        xs={12}
        sm={6}
        md={4}
        sx={{ width: "100%" }}
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
            <Box display="flex" padding="4px 8px 4px 16px" sx={{ background: "#F3F4F6" }}>
              <Typography noWrap variant="body2" color="text.secondary" component="div">
                {event.hostName}
              </Typography>
            </Box>
          </CardActionArea>
        </Card>

      </Grid>)
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
        padding="48px 0px"
        margin="0px 32px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          maxWidth="100%"
          margin="0px 36px 32px 36px"
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
        <Grid
          container
          spacing={2}
          sx={{ maxWidth: "100%" }}
        // padding={"16px 0px"}
        >
          <Grid
            item
            xs={12}
            md={3}
          >
            <Box display="flex" flexDirection="column" maxWidth="100%">
              {/* <Paper  // TODO: Uncomment this search bar if we were to implement full-text search
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
              </Paper> */}
              <Typography style={{ color: "#00000099", alignSelf: "flex-start" }}>Filter by dates</Typography>
              <FormControl component="fieldset" sx={{ padding: "12px 0px 12px" }}>
                {/* <FormLabel component="legend">Gender</FormLabel> */}
                <RadioGroup
                  aria-label="gender"
                  name="controlled-radio-buttons-group"
                  value={this.state.startDayRadioValue}
                  onChange={this.handleStartDayRadioValueChange}
                >
                  <FormControlLabel
                    value={DATE_FILTERING_OPTIONS.tomorrow}
                    control={<Radio />}
                    checked={this.state.startDayRadioValue === DATE_FILTERING_OPTIONS.tomorrow}
                    label="Tomorrow"
                    sx={{ color: "#00000099 !important" }}
                  />
                  <FormControlLabel
                    value={DATE_FILTERING_OPTIONS.thisWeekend}
                    control={<Radio />}
                    checked={this.state.startDayRadioValue === DATE_FILTERING_OPTIONS.thisWeekend}
                    label="This Weekend"
                    sx={{ color: "#00000099 !important" }}
                  />
                  <FormControlLabel
                    value={DATE_FILTERING_OPTIONS.startingAfter}
                    control={<Radio />}
                    checked={this.state.startDayRadioValue === DATE_FILTERING_OPTIONS.startingAfter}
                    label="Starting After"
                    sx={{ color: "#00000099 !important" }}
                  />
                </RadioGroup>
              </FormControl>
              <Datetime
                inputProps={{ placeholder: "Starting After" }}
                value={this.state.startTime}
                onChange={this.handleStartTimeChange}
                isValidDate={(current) => current.isAfter(moment().subtract(1, 'day'))}
                className="custom-datetime-picker"
                renderInput={(props, openCalendar, closeCalendar) => <input {...props} readOnly />}
                timeFormat={false}
              />
              <Button
                variant="outlined"
                sx={{ margin: "16px 0px" }}
                onClick={this.handleResetFiltersClick}
              >
                Reset Filters
              </Button>
            </Box>
          </Grid>
          {
            this.props.events.length != 0 &&
            <Grid
              item
              xs={12}
              md={9}
            >
              <Grid
                container
                spacing={2}
              >
                {this.getCards(this.props.events)}
              </Grid>
            </Grid>
          }
        </Grid>
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
    fetchEvents: (fetchParameter: EventsFetchParameter) => dispatch(fetchEvents(fetchParameter)),
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EventsLanding)

