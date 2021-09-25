import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import CreateAccount from './components/auth/CreateAccount';
import Homepage from './components/homepage/Homepage';
import Events from './components/events/Events';
// import Navbar 


function App() {
  // IMPORTANT: First route needs to be "<Route EXACT path = '/' component = {Homepage} >/
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path = '/' component = {Homepage} />
          <Route path = '/events' component = {Events} />
          <Route path = '/signin' component = {SignIn} />
          <Route path = '/createaccount' component = {CreateAccount} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
