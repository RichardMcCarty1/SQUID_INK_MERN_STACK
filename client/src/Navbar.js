import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { Link as Router } from 'react-router-dom';
class Navbar extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();



  };

  render() {

    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
            <Grid container alignItems="center" >
                <ButtonGroup  fullWidth disableElevation color="primary" aria-label="contained primary button group" size="large">
                    <Button variant="contained" component={Router} to="/" >
                        HOME
                    </Button>
                    <Button variant="contained" component={Router} to="/dashboard">
                        Dashboard
                    </Button>
                    <Button variant="contained" component={Router} to="/squid">
                        SQUID
                    </Button>
                    <Button variant="contained" component={Router} to="/upload">
                        upload form
                    </Button>
                    <Button variant="contained" component={Router} to="/myfiles">
                        See my files
                    </Button>
                </ButtonGroup>
            </Grid>
        </nav>
      </div>
    );
  }
}

export default Navbar;
