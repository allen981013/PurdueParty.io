import React, { Component } from 'react';
import { compose } from 'redux';
import { editEvent } from '../../store/actions/eventActions';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import Dropzone from 'react-dropzone'
import { EventInfoStatesRedux, fetchEventInfo } from './EventInfoSlice'

import Datetime from 'react-datetime'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
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

// Interface/type for EditProfile State
interface EditEventState {
  id: string,
  ownerID: string,
  editors: string[],
  orgID: string,
  title: string
  description: string,
  location: string,
  themes: string[],
  categories: string[],
  perks: string[],
  startTime: Date,
  endTime: Date,
  postedDateTime: Timestamp,
  attendees: string[],
  hasUpdated: boolean,
  image: File,
}

// Interface/type for EditProfile Props
interface EditEventProps {
  auth: any,
  firebase: any,
  match: any,
  events: any,
  editEvent: (state: EditEventState) => void
}

class EditEvent extends Component<EditEventProps, EditEventState> {
  themes = ["Arts & Music", "Athletics", "Charity/Service", "Cultural/Religious",
    "Greek Life", "Social", "Technology", "Education/Professional", "Other"];
  categories = ["Callout", "Informational", "Fundraiser", "Rush", "Performance",
    "Hackathon", "Rally", "Party/Celebration", "Study-abroad", "Other"];
  perks = ["Free food", "Free swag", "Credits", "None"];

  constructor(props: EditEventProps) {
    super(props);
    this.state = {
      id: "",
      ownerID: "",
      editors: [],
      orgID: "",
      title: "",
      description: "",
      location: "",
      perks: [],
      themes: [],
      image: null,
      categories: [],
      startTime: new Date(),
      endTime: new Date(),
      postedDateTime: new Timestamp(0, 0),
      attendees: [""],
      hasUpdated: false
    }
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
    if (this.state.title.length < 3 || this.state.title.length > 30) {
      // Pop modal for title length error
      console.log("Minimum title length required: 3 characters");
      window.alert("Required title length between 3-30 characters")
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
      console.log("Event Edit Successfully!");
      this.props.editEvent({ ...this.state, id: this.props.match.params.eventID });

      window.alert("Information submitted.")

      this.setState({
        id: "",
        ownerID: "",
        editors: [""],
        orgID: "",
        title: "",
        description: "",
        location: "",
        themes: [""],
        categories: [""],
        perks: [""],
        startTime: new Date(),
        endTime: new Date(),
        postedDateTime: new Timestamp(0, 0),
        attendees: [""]
      })

      // window.alert("Event Edit Successfully!")
      // window.history.back()
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

  render() {
    const { auth } = this.props;

    if (!auth.uid) return <Redirect to='/signin' />

    // Check if props has loaded correctly
    if (!(this.props.events)) {
      return (<CircularProgress sx={{ alignSelf: "center", padding: "164px" }}></CircularProgress>)
    }

    var curEvent: any = undefined;
    if (!this.state.hasUpdated && this.props.events && this.props.events.length == 1) {
      curEvent = this.props.events[0];
    }

    if (!this.state.hasUpdated && curEvent != undefined) {
      this.setState({
        ownerID: curEvent.ownerID,
        title: curEvent.title,
        description: curEvent.description,
        startTime: curEvent.startTime.toDate(),
        endTime: curEvent.endTime.toDate(),
        location: curEvent.location,
        themes: curEvent.themes,
        categories: curEvent.categories,
        perks: curEvent.perks,
        hasUpdated: true,
        editors: curEvent.editors,
        orgID: curEvent.orgID,
      })
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

          {/* 
              <h1>Enter associated organization:</h1>
              <div className = "input-field">
                <label htmlFor="type">Organization: </label>
                <input type ="text" value={this.state.orgID} placeholder="Who's hosting the party?" id="type" onChange={this.handleChangeOrgID}/>
              </div> */}

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

          <div className="input-field">
            <button className="button">Save</button>
          </div>

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
        </form >
      </Box >
    )
  }
}


const mapStateToProps = (state: any) => {
  return {
    auth: state.firebase.auth,
    events: state.firestore.ordered.events
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    editEvent: (event: any) => dispatch(editEvent(event))
  }
}

export default compose<React.ComponentType<EditEventProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: EditEventProps) => {
    if (typeof props.match != undefined) {
      return [
        {
          collection: 'events',
          doc: props.match.params.eventID
        }
      ]
    } else {
      return []
    }
  })
)(EditEvent)