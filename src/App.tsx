import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import Events from './components/events/Events';
import CreateEvent from './components/events/CreateEvent';


// import Navbar 


function App() {
  // IMPORTANT: First route needs to be "<Route EXACT path = '/' component = {Homepage} >/
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path = '/' component = {SignIn} />
          <Route path = '/events' component = {Events} />
          <Route path = '/create-event' component = {CreateEvent} />

        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
