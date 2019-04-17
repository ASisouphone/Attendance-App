import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit">GVSU Organization</Typography>
        <Button color="inherit" component={Link} to="/Landing" style={{marginLeft: 'auto'}} >Landing</Button>
        <Button color="inherit" component={Link} to="/Home">Home</Button>
        <Button color="inherit" component={Link} to="/Accoung">Account</Button>
        <Button color="inherit" component={Link} to="/Admin">Admin</Button>
        <SignOutButton />
      </Toolbar>
    </AppBar>
  </div>
);

const NavigationNonAuth = () => (
  <div>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit">GVSU Organization</Typography>
        <Button color="inherit" component={Link} to="/Home" style={{marginLeft: 'auto'}} >Home</Button>
        <Button color="inherit" component={Link} to="/signin">Sign In</Button>
      </Toolbar>
    </AppBar>
  </div>
);


export default Navigation;