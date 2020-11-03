import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
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
import Profile from '../../components/Profile';
import Board from '../../components/Board';
import ShareBoard from '../../components/ShareBoard';
import Loading from '../../layouts/Loading';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Loading loading={isLoading}/>
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/logIn">
              {/* Header */}
              <Header/>
              <LogIn setIsLoading={setIsLoading}/>
          </Route>
          <Route path="/signUp">
              {/* Header */}
              <Header/>
              <SignUp setIsLoading={setIsLoading}/>
          </Route>
          <Route path="/profile">
              {/* Header */}
              <Header/>
              <Profile setIsLoading={setIsLoading}/>
          </Route>
          <Route path="/dashboard">
            {/* Header */}
            <Header/>
            {/* End Header */}
            <DashBoard setIsLoading={setIsLoading}/>
            {/* Footer */}
            <Footer/>
            {/* End footer */}
          </Route>
          <Route path="/board/:userID/:boardID">
            {/* Header */}
            <Header/>
            {/* End Header */}
            <ShareBoard setIsLoading={setIsLoading}/>
            {/* Footer */}
            <Footer/>
            {/* End footer */}
          </Route>
          <Route path="/board/:id">
            {/* Header */}
            <Header/>
            {/* End Header */}
            <Board setIsLoading={setIsLoading}/>
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
