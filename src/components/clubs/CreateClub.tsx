import React, { Component } from 'react';
import { Dispatch, Action, compose } from 'redux';
import { addClub } from '../../store/actions/clubActions'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { AppDispatch, RootState } from '../../store';
import { Timestamp } from '@firebase/firestore';
import Dropzone from 'react-dropzone'


import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';

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
  event: string[]
}

// Interface/type for Clubs Props
interface ClubProps {
    auth: any,
    clubs: any,
    addClub: (state:ClubState) => void
}

class CreateClub extends Component<ClubProps, ClubState> {

  themes = ["Arts & Music", "Athletics", "Charity/Service", "Cultural/Religious",
    "Greek Life", "Social", "Technology", "Education/Professional", "Other"];

  // Initialize state
  constructor(props:ClubProps) {
    super(props);
    this.state = {
      orgId: "",
      owner: "",
      editors: [""],
      title: "",
      description: "",
      contactInfo: "",
      postedDateTime: new Timestamp(0,0),
      image: null as any,
      attendees: [""],
      category: [],
      event: [""]
    };
  }

  // General purpose state updater during form modification
  handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title : e.target.value
    })
  }

    // General purpose state updater during form modification
    handleChangeCategory = (e: any) => {
      this.setState({
        category : e.target.value
      })
    }

      // General purpose state updater during form modification
  handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description : e.target.value
    })
  }

    // General purpose state updater during form modification
    handleChangeContactInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        contactInfo : e.target.value
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
  handleSubmit = (event:any) => {
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
        console.log("I AM HERE!!!!!!!!!!!!!!!!!!!");
        console.log(this.state);
        this.props.addClub(this.state);
    
        window.alert("Club posted successfully!")

        this.setState({
          orgId: "",
          owner: "",
          editors: [""],
          title: "",
          description: "",
          contactInfo: "",
          postedDateTime: new Timestamp(0,0),
          attendees: [""],
          category: [],
          event: [""]
        })
      }
  }

  render() {
    console.log(this.props.clubs);
    console.log(this.state);
    return (
      <div>
        <form onSubmit = {this.handleSubmit}>
          <h1>Enter Club name:</h1>
          <div className = "input-field">
            <label htmlFor="title">Club Title: </label>
            <input type ="text" value={this.state.title} id="title" 
                   placeholder="Ex: Computer Science Club" onChange={this.handleChangeTitle}/>
          </div>

          <h1>Enter Club description:</h1>
          <div className = "input-field">
            <label htmlFor="description">Club description: </label>
            <input type ="text" value={this.state.description} id="description"
                   placeholder="Ex: We're a group of students who..."  onChange={this.handleChangeDescription}/>
          </div>

          <h1>Enter Club contact information:</h1>
          <div className = "input-field">
            <label htmlFor="contactInfo">Club Contact Information: </label>
            <input type ="text" value={this.state.contactInfo} id="contactInfo"
                   placeholder="Ex: Email: x@purdue.edu / Discord: discord.com/SlQj81LX" onChange={this.handleChangeContactInfo}/>
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
              input={<OutlinedInput label="Category"/>}
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

          <div className ="input-field">
            <button className = "button">Create New Club</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    clubs: state.firestore.ordered.clubs,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  // Insert functions from actions folder in similar syntax
  return {
    addClub: (club:any) => dispatch(addClub(club))
  }
}

export default compose<React.ComponentType<ClubProps>>(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'clubs'}
  ])
)(CreateClub)