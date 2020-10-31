import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import './App.css';
// Material UI Core
import CssBaseline from '@material-ui/core/CssBaseline';

// Components
import Header from '../Header';
import Footer from '../Footer';
import DashBoard from '../../components/DashBoard';
import LogIn from '../../components/LogIn';
import SignUp from '../../components/SignUp';

function App() {

  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/logIn">
              {/* Header */}
              <Header/>
              <LogIn/>
          </Route>
          <Route path="/signUp">
              {/* Header */}
              <Header/>
              <SignUp/>
          </Route>
          <Route path="/dashboard">
            {/* Header */}
            <Header/>
            {/* End Header */}
            <DashBoard/>
            {/* Footer */}
            <Footer/>
            {/* End footer */}
          </Route>
          <Route path="/">
            <Redirect to="/dashboard"/>
          </Route>
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
