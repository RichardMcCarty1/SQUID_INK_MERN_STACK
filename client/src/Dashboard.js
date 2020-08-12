import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../src/authActions";
//import LinkButton from "./src/actions/authActions";

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();

  };


 


  render() {
    const { user } = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            
            <h3>
              <b>Hello,</b> {user.name.split(" ")[0]} <b>.</b>
              <p className="flow-text grey-text text-darken-1">
                You are logged into SQUID INK.
              </p>
            </h3>

  

            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
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
