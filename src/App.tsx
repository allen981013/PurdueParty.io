import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './components/landing/Landing';
import SignIn from './components/auth/SignIn';
import ChangePassword from './components/auth/ChangePassword';
import ResetPasswordRequest from './components/auth/ResetPasswordRequest';
import CreateAccount from './components/auth/CreateAccount';
import MarketPlace from './components/marketplace/MarketPlace';
import EventsLanding from './components/events/EventsLanding';
import CreateEvent from './components/events/CreateEvent';
import EventInfo from './components/events/EventInfo';
import Clubs from './components/clubs/Clubs';
import CreateClub from './components/clubs/CreateClub';
import NavBar from './components/navbar/NavBar'
import createSellListing from './components/marketplace/create-sell-listings';
import GenericSellListing from './components/marketplace/GenericSellListing';
import CreatePost from './components/forum/create-post';
import Profile from './components/profile/Profile';
import Classes from './components/forum/Classes';
import PostsLanding from './components/forum/PostsLanding';
import EditProfile from './components/profile/EditProfile';
import EditEvent from './components/events/EditEvent';
import CreateClass from './components/forum/CreateClass';
import EditSellListing from './components/marketplace/EditSellListing';
import ThreadPage from './components/forum/ThreadPage'


function App() {
  // IMPORTANT: First route needs to be "<Route EXACT path = '/' component = {Homepage} >/
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route path='/signin' component={SignIn} />
          <Route path='/createaccount' component={CreateAccount} />
          <Route path='/changePassword' component={ChangePassword} />
          <Route path='/resetPasswordRequest' component={ResetPasswordRequest} />
          <Route exact path='/marketplace' component={MarketPlace} />
          <Route path='/marketplace/create-listing' component={createSellListing} />
          <Route path='/sellListing/:itemID' component={GenericSellListing} />
          <Route path='/events/create' component={CreateEvent} />
          <Route path='/events/:eventID' render={({ match }) => {
            return <EventInfo eventID={match.params.eventID} />
          }} />
          <Route path='/events' component={EventsLanding} />
          <Route exact path='/clubs' component={Clubs} />
          <Route path='/clubs/create-club' component={CreateClub} />
          <Route path='/forum/create-post' component={CreatePost} />
          <Route path='/profile' component={Profile} />
          <Route path='/edit-profile' component={EditProfile} />
          <Route exact path='/classes' component={Classes} />
          <Route path='/classes/:classID/:postID' render={({ match }) => {
            return <ThreadPage classID={match.params.classID} postID={match.params.postID} isDataFetched={false}/>
          }} />
          <Route path='/classes/:classID' render={({ match }) => {
            return <PostsLanding classID={match.params.classID} />
          }} />
          <Route path='/classes/create-post' component={CreatePost} />
          <Route path='/edit-event/:eventID' component={EditEvent} />
          <Route path='/create-class' component={CreateClass} />
          <Route path='/create-post/:classID' component={CreatePost} />
          <Route path='/edit-sellListing/:userID/:listingID' component={EditSellListing} />
        </Switch>
        <div style={{ flexGrow: 1 }} /> {/* hack to make footer stays at the bottom of the page */}
        <div className="w-100 bg-black" style={{ width: "100%", color: "#fff", padding: "20px 0px" }}>
          Purdue University, 100 North University Street, West Lafayette, IN, 47907
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
