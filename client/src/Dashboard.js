import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../src/authActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";


class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();

  };


 


  render() {
    const { user } = this.props.auth;

    return (
      <div>
        <div style={{
          margin: "0",
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Grid container
                justify="center"
                spacing={6}
          >
          <div className="landing-copy col s12 center-align">
            <Grid item xs={12}>
            <h2>
              <b>Hello,</b> {user.name.split(" ")[0]} <b>.</b>
              <p className="flow-text grey-text text-darken-1">
                You are logged into SQUID INK.
              </p>
            </h2>
          </Grid>
            <Grid item xs={12} style={{margin: "30px"}}>
            <Button variant="outlined" color="gray" size="large"
              onClick={this.onLogoutClick}
            >
              Logout
            </Button>
            </Grid>
          </div>
          </Grid>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
