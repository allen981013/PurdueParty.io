import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import Events from './components/events/Events';
import NavBar from './components/navbar/NavBar'
// import Navbar 


function App() {
  // IMPORTANT: First route needs to be "<Route EXACT path = '/' component = {Homepage} >/
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <Switch>
          <Route exact path = '/' component = {Events} />
          <Route path = '/events' component = {Events} />
          <Route path = '/signin' component = {SignIn} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
