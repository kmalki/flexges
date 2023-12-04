import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/home.js';
import Register from './components/register.js';
import Login from './components/login.js';
import Profile from './components/profile.js';
import Place from './components/place.js';
import Help from './components/help.js';
import Results from './components/results';
import ManageCompany from './components/manage_company';
import ManageUsers from './components/manageusers';
import ManageRooms from './components/managerooms';
import ManageSites from './components/managesites';
import RegisterUser from './components/registeruser.js';
import Sleep from './components/sleep.js';
import Kpi from './components/kpi.js';

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/place">
          <Place />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/help">
          <Help />
        </Route>
        <Route path="/results">
          <Results />
        </Route>
        <Route path="/manage">
          <ManageCompany />
        </Route>
        <Route path="/manageusers">
          <ManageUsers />
        </Route>
        <Route path="/managerooms">
          <ManageRooms />
        </Route>
        <Route path="/managesites">
          <ManageSites />
        </Route>
        <Route path="/RegisterUser">
          <RegisterUser />
        </Route>
        <Route path="/sleep">
          <Sleep />
        </Route>
        <Route path="/kpi">
          <Kpi />
        </Route>
        <Route path="/">
          <Register />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
