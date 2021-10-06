import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './components/landing/Landing';
import SignIn from './components/auth/SignIn';
import ChangePassword from './components/auth/ChangePassword';
import ResetPasswordRequest from './components/auth/ResetPasswordRequest';
import ResetPassword from './components/auth/ResetPassword';
import CreateAccount from './components/auth/CreateAccount';
import Homepage from './components/homepage/Homepage';
import MarketPlace from './components/marketplace/MarketPlace';
import Events from './components/events/Events';


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
          <Route path = '/signin' component = {SignIn} />
          <Route path = '/createaccount' component = {CreateAccount} />
          <Route path = '/changePassword' component = {ChangePassword} />
          <Route path = '/resetPassword' component = {ResetPassword} />
          <Route path = '/resetPasswordRequest' component = {ResetPasswordRequest} />

          <Route path = '/marketplace' component = {MarketPlace} />
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
