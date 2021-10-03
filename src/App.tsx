import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './components/landing/Landing';
import SignIn from './components/auth/SignIn';
import CreateAccount from './components/auth/CreateAccount';
import Homepage from './components/homepage/Homepage';
import MarketPlace from './components/marketplace/MarketPlace';
import CreateEvent from './components/events/CreateEvent';
import EventInfo from './components/events/EventInfo';
import NavBar from './components/navbar/NavBar'
import createSellListing from './components/marketplace/create-sell-listings';
import GenericSellListing from './components/marketplace/GenericSellListing';

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
          <Route exact path='/marketplace' component={MarketPlace} />
          <Route path='/marketplace/create-listing' component={createSellListing} />
          <Route path='/sellListing/:itemID' component={GenericSellListing} />
          <Route path='/events/create' component={CreateEvent} />
          <Route path='/events/:eventID' render={({match}) => {
            return <EventInfo eventID={match.params.eventID} />
          }}/>

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
