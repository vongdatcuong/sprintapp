import React from 'react';
import './Header.css';
// Material UI Core
import AppBar from '@material-ui/core/AppBar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


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
    position: 'absolute',
    right: '3px'
  }
}));

function Header() {
  const classes = useStyles();

  return (
    <AppBar position="relative" className="main-bg-blue">
        <Toolbar>
          <Typography variant="h6" className={classes.logo} color="inherit" noWrap>
            Sprint Retro
          </Typography>
          <AccountCircleIcon className={classes.icon}  />
        </Toolbar>
      </AppBar>
  );
}

export default Header;
