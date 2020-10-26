import React from 'react';
import logo from './logo.svg';
import './App.css';
// Material UI Core
import CssBaseline from '@material-ui/core/CssBaseline';

// Components
import Header from '../Header';
import Footer from '../Footer';
import DashBoard from '../../components/DashBoard';

function App() {

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Header */}
      <Header/>
      {/* End Header */}
      <DashBoard/>
      {/* Footer */}
      <Footer/>
      {/* End footer */}
    </React.Fragment>
  );
}

export default App;
