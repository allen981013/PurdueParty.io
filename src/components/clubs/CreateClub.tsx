import React, { Component, KeyboardEventHandler } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addClub } from '../../store/actions/clubActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Timestamp } from '@firebase/firestore';
import Dropzone from 'react-dropzone'
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import { IconButton, Grid, Box, CircularProgress } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { dropdownIndicatorCSS } from 'react-select/dist/declarations/src/components/indicators';

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

// Interface/type for Clubs Props
interface ClubProps {
  auth: any,
  clubs: any,
  addClub: (state: ClubState) => void,
  users: any,
}

class CreateClub extends Component<ClubProps, ClubState> {

  themes = ["Arts & Music", "Athletics", "Charity/Service", "Cultural/Religious",
    "Greek Life", "Social", "Technology", "Education/Professional", "Other"];

  // Initialize state
  constructor(props: ClubProps) {
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

  // General purpose state updater during form modification
  handleChangeCategory = (e: any) => {
    this.setState({
      category: e.target.value
    })
  }

  // General purpose state updater during form modification
  handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value
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
    else if (!this.state.contactInfo.includes("@purdue.edu")
      || this.state.contactInfo.split("@purdue.edu")[0].length < 1) { //
      // Pop modal if category is not selected
      window.alert("Please enter contact info that's a valid purdue email.");
    }
    else if (this.state.category.length < 1) { //
      // Pop modal if category is not selected
      window.alert("Please select at least 1 category relating to your club.");
    }
    else {
      // Create temp editor array with owner's ID
      var uid_arr: string[] = [];

      console.log("STATE HERE");
      console.log(this.state);

      // For each editor in the editors arr
      for (let i = 0; i < this.state.value.length; i++) {
        // Get the user object from users array with matching username
        var result = this.props.users.find(({ userName }: any) => userName === this.state.value[i].value);

        // Check if result if valid
        if (result == undefined) {
          window.alert("There was an invalid username that was entered. Please enter a valid username.")
          return;
        }
        else if (uid_arr.includes(result.id)) {
          window.alert("There was a duplicate username that was entered. Please remove the duplicate username.")
          return;
        }
        else {
          // Push the uid onto a new array
          uid_arr.push(result.id);
        }
      }

      // Add owner as an editor if not already in there
      if (!uid_arr.includes(this.props.auth.uid)) {
        uid_arr.push(this.props.auth.uid);
      }

      console.log("UID ARR HERE");
      console.log(uid_arr);

      // Edit the club with the new information after updating editors state
      this.setState({ editors: uid_arr }, () => {
        this.props.addClub(this.state);

        window.alert("Information submitted.")

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
        // window.alert("Club posted successfully!")
        // window.history.back();
      })
    }
  }

  render() {
    // Check if props has loaded correctly
    if (!(this.props.users && this.props.clubs)) {
      return (<CircularProgress sx={{ alignSelf: "center", padding: "164px" }}></CircularProgress>)
    }

    // Check if props has loaded correctly
    if (!(this.props.users && this.props.clubs)) {
      return (<CircularProgress sx={{ alignSelf: "center", padding: "164px" }}></CircularProgress>)
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

          <h1>List username of club editors:</h1>
          <CreatableSelect
            components={{ DropdownIndicator: null }}
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
            <button className="button">Create New Club</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.firebase.auth,
    clubs: state.firestore.ordered.clubs,
    users: state.firestore.ordered.users,
    currentUsername: state.auth.lastCheckedUsername,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    addClub: (club: any) => dispatch(addClub(club))
  }
}

export default compose<React.ComponentType<ClubProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(() => {
    return [
      {
        collection: 'clubs',
      },
      {
        collection: 'users'
      }
    ]
  })
)(CreateClub)