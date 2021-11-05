import { Component } from "react";
import { Timestamp} from 'firebase/firestore';
import { Redirect } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { editListingTitle, editListingDescription, editListingPrice, editListingContact, editListingImage, editListingType, deleteSellListing } from '../../store/actions/sellListingActions';
import Dropzone from 'react-dropzone';


interface EditSellListingState {
    contactInfo: string,
    description: string,
    id: string,
    image: File,
    owner: string,
    postedDateTime: Timestamp,
    price: number,
    title: string,
    type: string
}

interface EditSellListingProps {
    auth: any,
    firebase: any,
    match: any,
    history: any,
    sellListings: any,
    editListingTitle: (state: EditSellListingState) => void,
    editListingDescription: (state: EditSellListingState) => void,
    editListingPrice: (state: EditSellListingState) => void,
    editListingContact: (state: EditSellListingState) => void,
    editListingImage: (state: EditSellListingState) => void,
    editListingType: (state: EditSellListingState) => void,
    deleteSellListing : (state: EditSellListingState) => void
}

class EditSellListing extends Component<EditSellListingProps, EditSellListingState> {

    constructor(props:EditSellListingProps) {
        super(props);
        this.state = {
            contactInfo: "",
            description: "",
            id: "",
            image: null,
            owner: "",
            postedDateTime: undefined,
            price: -1,
            title: "",
            type: ""
        }
    }

    componentDidMount() {
        this.setState({
            id: this.props.match.params.listingID
        })
    }

    handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: e.target.value
        })
    }

    
    handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            price: parseFloat(e.target.valueAsNumber.toFixed(2))
        })
    }

    handleChangeContactInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            contactInfo: e.target.value
        })
    }

    handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            description: e.target.value
        })
    }

    handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            type: e.target.value
        })
    }

    handleChangeImage = (e: File) => {
        if (e == undefined) {
          window.alert("Please enter a valid file with a .JPG, .PNG, .JPEG extension.")
        }
        else {
          this.setState({
            image: e
          })
        }
    }


    handleSubmit = (event : any) => {
        event.preventDefault();

        // Phone # validation
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

        if (this.state.title.length > 0 && this.state.title.length < 3) { 
            // Pop modal for title length error
            window.alert("Minimum title length required: 3 characters");
        }
        else if (this.state.description.length > 0 && this.state.description.length < 10) {
            // Pop modal for description length error
            console.log("Minimum description Length Required: 10 characters");
            window.alert("Minimum description length required: 10 characters")
        }
        else if (this.state.price > 0 && isNaN(this.state.price)) { //
            window.alert("Please enter a valid price");
        }
        else if (this.state.contactInfo.length > 0 && !this.state.contactInfo.match(phoneno)) {
            window.alert("Please enter a valid phone #. Example Formats:\nXXX-XXX-XXX\nXXX.XXX.XXXX\nXXX XXX XXXX\nXXXXXXXXXX\netc");
        }
        else {
            window.alert("Listing updated successfully!")
            

            this.setState({ id: this.props.match.params.listingID}, () => {
                //Figure out what needs updating and call accordingly
                console.log(this.state);
                if (this.state.title.length > 0) {
                    this.props.editListingTitle(this.state);
                }
                if (this.state.description.length > 0) {
                    this.props.editListingDescription(this.state);
                }
                if (this.state.price > 0) {
                    this.props.editListingPrice(this.state);
                }
                if (this.state.contactInfo.length > 0) {
                    this.props.editListingContact(this.state);
                }
                if (this.state.image != null) {
                    this.props.editListingImage(this.state);
                }
                if (this.state.type.length > 0) {
                    this.props.editListingType(this.state);
                }

                this.setState({
                    contactInfo: "",
                    description: "",
                    id: "",
                    image: undefined,
                    owner: "",
                    postedDateTime: undefined,
                    price: -1,
                    title: "",
                    type: ""
                })
    
            });
        }
    }

    handleDelete = (event: any) => {
        event.preventDefault();
        var result : boolean = window.confirm("Are you sure you want to delete your sell listing?");
        if (result) {
            //user said yes
            this.props.deleteSellListing(this.state);

            this.setState({
                contactInfo: "",
                description: "",
                id: "",
                image: null,
                owner: "",
                postedDateTime: undefined,
                price: -1,
                title: "",
                type: ""
            })
            //Maybe use this.props.history.push()

            window.alert("Listing Deleted Successfully!");
            this.props.history.push("/marketplace");
        }
        // User said no, do nothing
    }

    render() {
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin'/>
        
        // Prevent non-owner from accessing this page through URL manipulation
        if (this.props.sellListings) {
            if (auth.uid != this.props.sellListings[0].owner) {
                return <Redirect to='/signin'/>
            }    
        }

        return (
            <div>
                <h1>Update Desired Fields (Fields left blank will remain unchanged)</h1>
                <form onSubmit={this.handleSubmit}>
                    <h3>Update Title</h3>
                    <div className = "input-field">
                        <label htmlFor="title">Sell-Listing Title: </label>
                        <input type ="text" value={this.state.title} id="title" onChange={this.handleChangeTitle}/>
                    </div>
                    <h3>Update Description</h3>
                    <div className = "input-field">
                        <label htmlFor="title">Sell-Listing Description: </label>
                        <input type ="text" value={this.state.description} id="description" onChange={this.handleChangeDescription}/>
                    </div>
                    <h3>Update Type</h3>
                    <div className = "input-field">
                        <label htmlFor="title">Sell-Listing Type: </label>
                        <input type ="text" value={this.state.type} id="type" onChange={this.handleChangeType}/>
                    </div>
                    <h3>Update Price</h3>
                    <div className = "input-field">
                        <label htmlFor="price">Sell-Listing Price: </label>
                        <input type="number" id="price" onChange={this.handleChangePrice}/>
                    </div>
                    <h3>Update Phone Number</h3>
                    <div>
                        <label htmlFor="contactInfo">Sell-Listing Contact Info: </label>
                        <input type ="text" value={this.state.contactInfo} id="contactInfo" onChange={this.handleChangeContactInfo} />
                    </div>
                    <h3>Update Image</h3>
                    <Dropzone
                        accept="image/jpeg, image/jpg, image/png"
                        maxFiles={1}
                        onDrop={inputtedFile => 
                        this.handleChangeImage(inputtedFile[0])
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

                    <div>
                        <button className = "button">Submit Updates</button>
                    </div>
                </form>

                <form onSubmit={this.handleDelete}>
                    <div>
                        <button className = "button">Delete Listing</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
      sellListings: state.firestore.ordered.sellListings,
      auth: state.firebase.auth
    }
}
  
const mapDispatchToProps = (dispatch: AppDispatch) => {
    // Insert functions from actions folder in similar syntax
    return {
        editListingTitle: (sellListing : any) => dispatch(editListingTitle(sellListing)),
        editListingDescription: (sellListing : any) => dispatch(editListingDescription(sellListing)),
        editListingPrice: (sellListing : any) => dispatch(editListingPrice(sellListing)),
        editListingContact: (sellListing : any) => dispatch(editListingContact(sellListing)),
        editListingImage: (sellListing : any) => dispatch(editListingImage(sellListing)),
        editListingType: (sellListing : any) => dispatch(editListingType(sellListing)),
        deleteSellListing: (sellListing : any) => dispatch(deleteSellListing(sellListing))
    }
}

export default compose<React.ComponentType<EditSellListingProps>>(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props:EditSellListingProps) => {
        if (typeof props.match.params != undefined) {
          return [
            { 
              collection: 'sellListings',
              doc: props.match.params.listingID
            }
          ]
        } else {
          return []
        }
      })
)(EditSellListing)
  