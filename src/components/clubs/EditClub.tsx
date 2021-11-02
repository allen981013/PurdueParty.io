import React, { Component, KeyboardEventHandler } from 'react';
import { compose } from 'redux';
import { editClub } from '../../store/actions/clubActions';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Redirect } from 'react-router-dom'
import { Timestamp } from '@firebase/firestore';
import Dropzone from 'react-dropzone'
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import { IconButton, Grid, Box, CircularProgress } from '@mui/material';
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

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

// Interface/type for Clubs State
interface ClubState {
  orgId: string,
  owner: string,
  editors: string[],
  title: string
  description: string,
  contactInfo: string,
  postedDateTime: Timestamp,
  image: File,
  attendees: string[],
  category: string[],
  events: string[],
  readonly inputValue: string,
  readonly value: readonly Option[],
  hasUpdated: boolean
}

// Interface/type for EditProfile Props
interface EditClubProps {
  auth: any,
  users: any,
  firebase: any,
  match: any,
  clubs: any,
  editClub: (state: ClubState) => void,
}

class EditClub extends Component<EditClubProps, ClubState> {
  themes = ["Arts & Music", "Athletics", "Charity/Service", "Cultural/Religious",
    "Greek Life", "Social", "Technology", "Education/Professional", "Other"];

  constructor(props: EditClubProps) {
    super(props);
    this.state = {
      orgId: "",
      owner: "",
      editors: [],
      title: "",
      description: "",
      contactInfo: "",
      postedDateTime: new Timestamp(0, 0),
      image: null as any,
      attendees: [],
      category: [],
      events: [],
      inputValue: "",
      value: [],
      hasUpdated: false
    }
  }

  handleChange = (
    value: OnChangeValue<Option, true>,
    actionMeta: ActionMeta<Option>
  ) => {
    console.log(this.state);
    console.group('Value Changed');
    console.log(value);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();

    this.setState({ value });
  };

  handleInputChange = (inputValue: string) => {
    console.log(this.state);
    this.setState({ inputValue });
  };

  handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    console.log(this.state);
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':

        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)],
        });

        event.preventDefault();
    }
  };

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

  handleChangeCategory = (e: any) => {
    this.setState({
      category: e.target.value
    })
  }

  // General purpose state updater during form modification
  handleChangeContactInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      contactInfo: e.target.value
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
    else if (this.state.category.length == 0) {
      // Pop modal for no categories error
      window.alert("Please select a category from the dropdown")
    }
    else if (!this.state.contactInfo.includes("@purdue.edu")
      || this.state.contactInfo.split("@purdue.edu")[0].length < 1) { //
      // Pop modal if category is not selected
      window.alert("Please enter contact info that's a valid purdue email.");
    }
    else {
      // Create temp editor array with owner's ID
      var uid_arr = [];

      // Add other editors if they exist
      if (this.state.value.length > 1) {
        // For each editor in the editors arr
        for (let i = 0; i < this.state.value.length; i++) {
          // Get the user object from users array with matching username
          var result = this.props.users.find(({ userName }: any) => userName === this.state.value[i].value);

          // Check if result if valid
          if (result == undefined) {
            window.alert("There was an invalid username that was entered. Please enter a valid username.")
            return;
          }
          else {
            // Push the uid onto a new array
            uid_arr.push(result.id);
          }
        }
      }
      else {
        uid_arr.push(this.props.auth.uid);
      }

      // Edit the club with the new information after updating editors state
      this.setState({ editors: uid_arr }, () => {
        this.props.editClub(this.state);

        this.setState({
          orgId: "",
          owner: "",
          editors: [""],
          title: "",
          description: "",
          contactInfo: "",
          postedDateTime: new Timestamp(0, 0),
          attendees: [""],
          category: [],
          events: [],
          inputValue: "",
          value: []
        })
        window.alert("Club posted successfully!")
        window.history.back();
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
          defaultValue={this.state.category}
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
    if (!(this.props.users && this.props.clubs)) {
      return (<CircularProgress sx={{ alignSelf: "center", padding: "164px" }}></CircularProgress>)
    }

    var curClub: any = undefined;
    if (!this.state.hasUpdated && this.props.clubs && this.props.clubs.length == 1) {
      curClub = this.props.clubs[0];
    }

    if (!this.state.hasUpdated && curClub != undefined) {
      var values = [];

      // For each editor in the editors arr
      for (let i = 0; i < curClub.editors.length; i++) {

        // Get the user object from users array with matching username
        var result = this.props.users.find(({ id }: any) => id === curClub.editors[i]);

        // Push the uid onto a new array
        values.push(createOption(result.userName));
      }

      this.setState({
        orgId: curClub.orgId,
        owner: curClub.owner,
        editors: curClub.editors,
        title: curClub.title,
        description: curClub.description,
        contactInfo: curClub.contactInfo,
        postedDateTime: curClub.postedDateTime,
        attendees: curClub.attendees,
        category: curClub.category,
        events: curClub.events,
        inputValue: "",
        value: values,
        hasUpdated: true,
      })
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h1>Enter Club name:</h1>
          <div className="input-field">
            <label htmlFor="title">Club Title: </label>
            <input type="text" value={this.state.title} id="title"
              placeholder="Ex: Computer Science Club" onChange={this.handleChangeTitle} />
          </div>

          <h1>Enter Club description:</h1>
          <div className="input-field">
            <label htmlFor="description">Club description: </label>
            <input type="text" value={this.state.description} id="description"
              placeholder="Ex: We're a group of students who..." onChange={this.handleChangeDescription} />
          </div>

          {this.state.owner == this.props.auth.uid &&
            <div>
              <h1>List username of club editors:</h1>
              <CreatableSelect
                inputValue={this.state.inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Enter usernames and hit enter/tab after each..."
                value={this.state.value}
              />
            </div>
          }

          <h1>Enter Club contact information:</h1>
          <div className="input-field">
            <label htmlFor="contactInfo">Club Contact Information: </label>
            <input type="text" value={this.state.contactInfo} id="contactInfo"
              placeholder="Ex: Email: x@purdue.edu / Discord: discord.com/SlQj81LX" onChange={this.handleChangeContactInfo} />
          </div>

          <h1>Enter Club category:</h1>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="a">Category</InputLabel>
            <Select
              labelId="label"
              id="select"
              multiple
              value={this.state.category}
              onChange={this.handleChangeCategory}
              input={<OutlinedInput label="Category" />}
              MenuProps={MenuProps}
            >
              {this.themes.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            <button className="button">Save</button>
          </div>
        </form>
      </div>
    )
  }
}


const mapStateToProps = (state: any) => {
  return {
    auth: state.firebase.auth,
    clubs: state.firestore.ordered.clubs,
    users: state.firestore.ordered.users,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    editClub: (club: any) => dispatch(editClub(club))
  }
}

export default compose<React.ComponentType<EditClubProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: EditClubProps) => {
    if (typeof props.match != undefined) {
      return [
        {
          collection: 'users'
        },
        {
          collection: 'clubs',
          doc: props.match.params.clubID
        }
      ]
    } else {
      return []
    }
  })
)(EditClub)