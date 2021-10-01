import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './components/landing/Landing';
import SignIn from './components/auth/SignIn';
import Homepage from './components/homepage/Homepage';
import MarketPlace from './components/marketplace/MarketPlace';
import Events from './components/events/Events';
import CreateEvent from './components/events/CreateEvent';


// import Navbar 
import NavBar from './components/navbar/NavBar'
import createSellListing from './components/marketplace/create-sell-listings';
import GenericSellListing from './components/marketplace/GenericSellListing';

function App() {
  // IMPORTANT: First route needs to be "<Route EXACT path = '/' component = {Homepage} >/
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <Switch>
          <Route exact path = '/' component = {Landing} />
          <Route path = '/events' component = {Events} />
          <Route path = '/create-event' component = {CreateEvent} />

          <Route path = '/signin' component = {SignIn} />

          <Route exact path = '/marketplace' component = {MarketPlace} />
          <Route path = '/marketplace/create-listing' component = {createSellListing} />
          <Route path = '/sellListing/:itemID' component = {GenericSellListing} />

        </Switch>
        <div style={{flexGrow:1}}/> {/* hack to make footer stays at the bottom of the page */}
        <div className="w-100 bg-black" style={{width: "100%", color: "#fff", padding: "20px 0px"}}>
          Purdue University, 100 North University Street, West Lafayette, IN, 47907
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
