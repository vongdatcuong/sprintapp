import React from 'react';
import { useHistory } from "react-router-dom";
import './Header.css';
// Material UI Core
import AppBar from '@material-ui/core/AppBar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// Constant && Services
import AuthService from '../../services/auth.service';

const useStyles = makeStyles((theme) => ({
  logo: {
    fontSize: '30px',
    fontFamily: 'ThirstyScript',
    fontWeight: 'bold'
  },
  icon: {
    marginRight: theme.spacing(2),
    fontFamily: 'ThirstyScript',
    fontSize: '40px',
    
  },
  rightNavBar: {
    position: 'absolute',
    right: '3px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  navBarHeading: {
    fontFamily: 'Calibri',
    fontSize: '1.9em',
    marginRight: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      color: '#555555'
    }
  }
}));

function Header() {
  const classes = useStyles();
  const history = useHistory();
  const user = AuthService.getCurrentUser();
  const navHeadings = [];

  function handleLogOut(){
    AuthService.logOut();
    history.push('/logIn');
  }

  if (user){
    navHeadings.push(<Typography variant="h6" color="inherit" noWrap className={classes.navBarHeading} onClick={handleLogOut}>
                      Log Out
                    </Typography>)
  }

  return (
    <AppBar position="relative" className="main-bg-blue">
        <Toolbar>
          <Typography variant="h6" className={classes.logo} color="inherit" noWrap>
            Sprint Retro
          </Typography>
          <div className={classes.rightNavBar}>
            {navHeadings}
            <AccountCircleIcon className={classes.icon}  />
          </div>
        </Toolbar>
      </AppBar>
  );
}

export default Header;
