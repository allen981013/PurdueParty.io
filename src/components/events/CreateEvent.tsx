import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addEvent } from '../../store/actions/eventActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom';
import { Timestamp } from '@firebase/firestore';
import { IconButton, Grid, Box, CircularProgress } from '@mui/material';
import ReactModal from 'react-modal';
import Dropzone from 'react-dropzone';

import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Datetime from 'react-datetime';

import { now } from 'moment';
import { Label } from '@mui/icons-material';
import moment from 'moment';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(selectedItem: string, items: string[], theme: any) {
  return {
    fontWeight:
      items.indexOf(selectedItem) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// Interface/type for Events State
interface EventState {
  id: string,
  ownerID: string,
  editors: string[],
  orgID: string,
  title: string
  description: string,
  location: string,
  image: File,
  themes: string[],
  categories: string[],
  perks: string[],
  startTime: Date,
  endTime: Date,
  postedDateTime: Timestamp,
  attendees: string[],
}

// Interface/type for Events Props
interface EventProps {
  auth: any,
  users: any,
  events: any,
  clubs: any,

  createWasSuccessful: boolean,
  isDataFetched: boolean

  addEvent: (state: EventState) => void
}

class CreateEvent extends Component<EventProps, EventState> {
  themes = ["Arts & Music", "Athletics", "Charity/Service", "Cultural/Religious",
    "Greek Life", "Social", "Technology", "Education/Professional", "Other"];
  categories = ["Callout", "Informational", "Fundraiser", "Rush", "Performance",
    "Hackathon", "Rally", "Party/Celebration", "Study-abroad", "Other"];
  perks = ["Free food", "Free swag", "Credits", "None"];

  // Initialize state
  constructor(props: EventProps) {
    super(props);
    this.state = {
      id: "",
      ownerID: "",
      editors: [this.props.auth.uid],
      orgID: "",
      title: "",
      description: "",
      location: "",
      image: null as any,
      perks: [],
      themes: [],
      categories: [],
      startTime: new Date(),
      endTime: new Date(),
      postedDateTime: new Timestamp(0, 0),
      attendees: [""],
    };
  }

  // General purpose state updater during form modification
  handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value
    })
  }

  handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value
    })
  }

  handleChangeDateTime = (e: any) => {
    this.setState({
      startTime: e.toDate()
    })
  }

  handleChangeDateTimeEnd = (e: any) => {
    this.setState({
      endTime: e.toDate()
    })
  }

  handleChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      location: e.target.value
    })
  }

  handleChangeOrgID = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      orgID: e.target.value
    })
  }

  handleChangeThemes = (e: any) => {
    this.setState({
      themes: e.target.value
    })
  }

  handleChangeCategory = (e: any) => {
    this.setState({
      categories: e.target.value
    })
  }

  handleChangePerks = (e: any) => {
    this.setState({
      perks: e.target.value
    })
  }

  // General purpose state updater during form modification
  handleInputImage = (e: File) => {
    console.log(typeof (e));
    console.log(e);
    console.log(this.state);

    if (e == undefined) {
      window.alert("Please enter a valid file with a .JPG, .PNG, .JPEG extension.")
    }
    else {
      this.setState({
        image: e
      })
    }
  }

  // Handle user submit
  handleSubmit = (event: any) => {
    event.preventDefault();

    if (this.state.title.length < 3) {
      // Pop modal for title length error
      console.log("Minimum title length required: 3 characters");
      window.alert("Minimum title length required: 3 characters")
    }
    else if (this.state.description.length < 10) {
      // Pop modal for description length error
      console.log("Minimum description Length Required: 10 characters");
      window.alert("Minimum description length required: 10 characters")
    }
    else if (this.state.startTime < new Date()) { //
      // Pop modal if date entered is before now
      console.log("Please enter a valid upcoming date/time");
      window.alert("Please enter a valid upcoming date/time");
    }
    else if (this.state.startTime > this.state.endTime) { //
      // Pop modal if date entered is before now
      console.log("Please enter a valid upcoming date/time");
      window.alert("Please enter an ending time that's after the starting time.");
    }
    else if (this.state.location.length < 3) {
      // Pop modal for if the location is not 3 chars
      console.log("Minimum location length required: 3 characters");
      window.alert("Minimum location length required: 3 characters");
    }
    // else if (this.state.orgID === "") {
    //   // Pop modal for no org ID error
    //   console.log("Please select orgID from dropdown");
    //   window.alert("Please select an organization from the dropdown")
    // }
    else if (this.state.themes.length == 0) {
      // Pop modal for no themes error
      window.alert("Please select a theme from the dropdown")
    }
    else if (this.state.categories.length == 0) {
      // Pop modal for no categories error
      window.alert("Please select a category from the dropdown")
    } else if (this.state.perks.length == 0) {
      // Pop modal for no perks error
      window.alert("Please select a perk from the dropdown")
    }
    else {
      this.props.addEvent(this.state);

      window.alert("Information submitted.")


      this.setState({
        id: "",
        ownerID: "",
        editors: [""],
        orgID: "",
        title: "",
        description: "",
        location: "",
        image: null as any,
        themes: [""],
        categories: [""],
        perks: [""],
        startTime: new Date(),
        endTime: new Date(),
        postedDateTime: new Timestamp(0, 0),
        attendees: [""]
      })
    }
  }

  getMultipleSelect(selectedItems: string[], items: string[], handler: (e: any) => void, Tag: string) {
    return (
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id={Tag + "-label"}>{Tag}</InputLabel>
        <Select
          labelId={Tag + "-label"}
          id={Tag + "-select"}
          multiple
          value={selectedItems}
          onChange={handler}
          input={<OutlinedInput label={Tag} />}
          MenuProps={MenuProps}
        >
          {items.map((item) => (
            <MenuItem
              key={item}
              value={item}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  handleClubSelect = (event: any) => {
    this.setState({
      orgID: event.target.value
    })
  }

  render() {
    // Check if user has access to this page
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />

    // Check if props has loaded correctly
    if (!(this.props.users && this.props.clubs)) {
     return(<CircularProgress sx={{alignSelf: "center", padding: "164px"}}></CircularProgress>)
    }

    // Set variables we need
    var curUser = this.props.users[0];
    var clubs = [];

    // Check if vars we need are defined again
    if (curUser != null) {
      if (curUser.canEditClubs != undefined) {

        // If the length of the user's canEditClubsList
        if (curUser.canEditClubs.length > 0) {
          // For each clubID in the canEditClubs arr
          for (let i = 0; i < curUser.canEditClubs.length; i++) {
            // Get the user object from users array with matching username
            var result = this.props.clubs.find(({ id }: any) => id === curUser.canEditClubs[i]);

            // Check if result if valid
            if (result == undefined) {
              console.log("There was an error. A club id that was added was invalid")
              return;
            }
            else {
              // Push the uid onto a new array
              clubs.push(result);
            }
          }
        }
      }
    }

    var renderEdit: boolean = false;
    if (clubs.length > 0) {
      renderEdit = true;
    }

    var editCode: any = <div></div>;
    if (renderEdit) {
      editCode = <div>
        <h1>Enter the associated club for this event</h1>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Clubs</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.orgID}
            label="selectedOrg"
            onChange={this.handleClubSelect}
          >

            {clubs.map((club) => (
              <MenuItem value={club.id}>{club.title}</MenuItem>
            ))}
            <MenuItem value={"None"}>None</MenuItem>
          </Select>
        </FormControl></div>
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
        <form onSubmit={this.handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1>Enter event title:</h1>
          <div className="input-field">
            <label htmlFor="title">Event Title: </label>
            <input type="text" value={this.state.title} placeholder="What do you want your event to be called?"
              id="title" onChange={this.handleChangeTitle} />
          </div>

          <h1>Enter event description:</h1>
          <div className="input-field">
            <label htmlFor="description">Event description: </label>
            <input type="text" value={this.state.description} placeholder="What's your event about?" id="description"
              onChange={this.handleChangeDescription} />
          </div>

          <h1>Enter event starting date and time:</h1>
          <Box width="300px">
            <Datetime
              value={this.state.startTime}
              onChange={this.handleChangeDateTime}
              isValidDate={(current) => current.isAfter(moment().subtract(1, 'day'))}
              className="custom-datetime-picker"
              renderInput={(props, openCalendar, closeCalendar) => <input {...props} readOnly />}
            />
          </Box>
          <h1>Enter event ending date and time:</h1>
          <Box width="300px">
            <Datetime
              value={this.state.endTime}
              onChange={this.handleChangeDateTimeEnd}
              isValidDate={(current) => current.isAfter(moment().subtract(1, 'day'))}
              className="custom-datetime-picker"
              renderInput={(props, openCalendar, closeCalendar) => <input {...props} readOnly />}
            />
          </Box>

          <h1>Enter event location:</h1>
          <div className="input-field">
            <label htmlFor="location">Event location: </label>
            <input type="text" value={this.state.location} placeholder="Where's this going down?" id="location"
              onChange={this.handleChangeLocation} />
          </div>

          {editCode}

          <h1>Enter event theme:</h1>
          {this.getMultipleSelect(this.state.themes, this.themes, this.handleChangeThemes, "Themes")}

          <h1>Enter event category:</h1>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="a">Category</InputLabel>
            <Select
              labelId="label"
              id="select"
              multiple
              value={this.state.categories}
              onChange={this.handleChangeCategory}
              input={<OutlinedInput label="Category" />}
              MenuProps={MenuProps}
            >
              {this.categories.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <h1>Enter event perks:</h1>
          {this.getMultipleSelect(this.state.perks, this.perks, this.handleChangePerks, "Perks")}

          <Dropzone
            accept="image/jpeg, image/jpg, image/png"
            maxFiles={1}
            onDrop={inputtedFile =>
              this.handleInputImage(inputtedFile[0])
            }
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Click here to upload a picture. JPG, JPEG, or PNG only.</p>
                </div>
              </section>
            )}
          </Dropzone>

          <div className="input-field">
            <button className="button">Create New Event</button>
          </div>

        </form>
      </Box>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    auth: state.firebase.auth,
    createWasSuccessful: state.event.createWasSuccessful,
    users: state.firestore.ordered.users,
    events: state.firestore.ordered.events,
    clubs: state.firestore.ordered.createEventClubs
  }
}

const mapDispatchToProps = (dispatch: (action: any) => void) => {
  // Insert functions from actions folder in similar syntax
  return {
    addEvent: (event: any) => dispatch(addEvent(event))
  }
}

export default compose<React.ComponentType<EventProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: EventProps) => {
    if (props.auth != undefined) {
      return [
        {
          collection: 'users',
          doc: props.auth.uid
        },
        {
          collection: 'events'
        },
        {
          collection: 'clubs', storeAs: 'createEventClubs'
        }
      ]
    } else {
      return []
    }
  })
)(CreateEvent) 