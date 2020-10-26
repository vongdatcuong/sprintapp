import React from 'react';
// Material UI Core
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Copyright from './Copyright';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
    position: 'absolute',
    width: '100%',
    bottom: 0
  },
}));

function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Sprint App
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Make your own Agile/Scrum
        </Typography>
        <Copyright />
    </footer>
  );
}


export default Footer;
