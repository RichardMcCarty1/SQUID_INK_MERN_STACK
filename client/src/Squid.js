// @flow
import React, { Component, Fragment } from "react";
import { bindActionCreators } from "../node_modules/redux";
import axios from "../node_modules/axios";
//import style from './squid.scss'
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import { FormHelperText } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from "@material-ui/core/RadioGroup";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import classnames from "classnames";

const endpoint = "https://cirdles.cs.cofc.edu/Services/squidReporting";
//const FileDownload = require("downloadjs");
// checkout https://www.npmjs.com/package/rn-fetch-blob for soultion involving progress etc

class SquidPage extends Component {
 constructor(props) {
    super(props);
    this.handleselectedPrawnFile = this.handleselectedPrawnFile.bind(this);
    this.handleselectedTaskFile = this.handleselectedTaskFile.bind(this);
    this.handleRefMatFilterChange = this.handleRefMatFilterChange.bind(this);
    this.handleConcRefMatFilterChange = this.handleConcRefMatFilterChange.bind(
      this
    );
    this.handleUpload = this.handleUpload.bind(this);
    this.handleNormalizeSBMChange = this.handleNormalizeSBMChange.bind(this);
    this.handleRatioCalculationMethodChange = this.handleRatioCalculationMethodChange.bind(
      this
    );
    this.handlePreferredIndexIsotopeChange = this.handlePreferredIndexIsotopeChange.bind(
      this
    );
 this.state = {
      selectedPrawnFile: null,
      selectedTaskFile: null,
      refMatFilter: "",
      concRefMatFilter: "",
      normalizeSBM: true,
      ratioCalculationMethod: false,
      preferredIndexIsotope: "PB_204",
      loaded: 0
    };
    
    
    
  }

  handleselectedPrawnFile(event) {
    this.setState({
      selectedPrawnFile: event.target.files[0],
      loaded: 0
    });
    const {PRAWNFile} = this.state; 
    localStorage.setItem('PRAWNFile', event.target.value)
  }

  handleselectedTaskFile(event) {
    this.setState({
      selectedTaskFile: event.target.files[0],
      loaded: 0
    });
    const {TaskFile} = this.state; 
    localStorage.setItem('TaskFile', event.target.value)
  }
//first filter on page 
  handleRefMatFilterChange(event) {
    this.setState({ refMatFilter: event.target.value });
    const {HandRefMatFilter} = this.state; 
    localStorage.setItem('RefMatFilter', event.target.value)
  }

  handleConcRefMatFilterChange(event) {
    this.setState({ concRefMatFilter: event.target.value });
    const {HandConcRefMatFilter} = this.state; 
    localStorage.setItem('ConcRefMatFilter', event.target.value)
  }

  handleNormalizeSBMChange(changeEvent) {
    this.setState({ normalizeSBM: changeEvent.target.value});
    const {SBMChange} = this.state; 
    localStorage.setItem('SBMChange', changeEvent.target.value)
  }

  handleRatioCalculationMethodChange(changeEvent) {
    this.setState({
      ratioCalculationMethod:
        changeEvent.target.id === "ratioCalcMethodRegression"
    });
    const {RatioCalculationMethodChange} = this.state; 
    localStorage.setItem('RatioCalculationMethodChange', changeEvent.target.id)
  }

  handlePreferredIndexIsotopeChange(changeEvent) {
    this.setState({
      preferredIndexIsotope: changeEvent.target.value
    });
  }

  handleUpload() {
    const data = new FormData();
    if (
      this.state.selectedPrawnFile != null &&
      this.state.selectedTaskFile != null
    ) {
        data.append("prawnFile", this.state.selectedPrawnFile);
        data.append("taskFile", this.state.selectedTaskFile);
        data.append("useSBM", this.state.normalizeSBM);
        data.append("userLinFits", this.state.ratioCalculationMethod);
        data.append("refMatFilter", this.state.refMatFilter);
        data.append("concRefMatFilter", this.state.concRefMatFilter);
        data.append("prefIndexIso", this.state.preferredIndexIsotope);

    }
  }
  render() {
    return (

      <Fragment>
          <div style={{
              margin: "0",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -70%)"
          }}>
              <Grid container
                    justify="center"
                    spacing={12}
              >
      <Box   borderColor="#3F51B5" border={2} justifyContent="center" display="flex" p={1} bgcolor="#e3e5e8" >
        <div className="squid container my-3 p-3 d-flex flex-column justify-content-center border border-squid rounded">
          <div className="row m-3">
            <div className="col">
              <label className="my-auto">Zipped Prawn XML file:</label>
              <div className="custom-file">
                  <Grid item xs={12}>
                <Button
                    variant="contained"
                    component="label"
                >
                    <pre style={{fontFamily: "helvetica"}}>Upload File: </pre>
                  <Input hidden
                      type="file"
                      name="prawnFile"
                      id="prawnFileInput"
                      style={{display: 'none'}}
                      onChange={this.handleselectedPrawnFile}
                  /><label htmlFor="prawnFileInput">
                 {this.state.selectedPrawnFile &&
                    this.state.selectedPrawnFile.name}
                </label>
                </Button>
                  </Grid>

            <div className="col" style={{marginTop: "20px"}}>
              <label className="my-auto">Squid2.* Task XLS file:</label>
              <div className="custom-file">
                  <Grid item xs={12}>
                  <Button
                      variant="contained"
                      component="label"
                  >
                      <pre style={{fontFamily: "helvetica"}}>Upload File: </pre>
                <input
                  type="file"
                  name="taskFile"
                  id="taskFileInput"
                  style={{display: 'none'}}
                  onChange={this.handleselectedTaskFile}
                /><label htmlFor="prawnFileInput">
                      {this.state.selectedTaskFile &&
                      this.state.selectedTaskFile.name}
                  </label>
                  </Button>
                  </Grid>
              </div>
            </div>
          </div>
          </div>
          </div>
        <Grid item xs={12}>
            <FormControl style={{marginTop: "20px"}}>
                <InputLabel htmlFor="component-simple">Reference Material Sample Name Filter:</InputLabel>
                <Input style={{width: "500px"}}
                       id="refMatFilterInput"
                       name="refMatFilter"
                       onChange={this.handleRefMatFilterChange}
                       type="text" />
            </FormControl>
        </Grid>
        <Grid item xs={12}>
            <FormControl style={{marginTop: "20px"}}>
                <InputLabel htmlFor="component-simple">Concentration Reference Material Sample Name Filter:</InputLabel>
                <Input style={{width: "500px"}}
                       id="concRefMatFilterInput"
                       name="confcRefMatFilter"
                       onChange={this.handleRefMatFilterChange}
                       type="text"
                       />
            </FormControl>
        </Grid>

        <Grid item xs={12}>
          <div className="row m-3" style={{marginTop: "20px"}}>
              <FormControl component="fieldset">
                  <FormLabel component="legend">Normalize Ion Counts for SBM?</FormLabel>
                  <RadioGroup aria-label="NormalizeSBM" name="normalizeSBM" onChange={this.handleNormalizeSBMChange}
                              style={{display: "inline-block"}}>
                      <FormControlLabel id="normalizeSBMYes" value="normalizeSBMYes" control={<Radio />} label="Yes" />
                      <FormControlLabel id="normalizeSBMNo" value="normalizeSBMNo" control={<Radio />} label="No" />
                  </RadioGroup>
              </FormControl>
          </div>
        </Grid>

            <Grid item xs={12}>
                <div className="row m-3" style={{marginTop: "20px"}}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Ratio Calculation Method:</FormLabel>
                        <RadioGroup aria-label="RatioCalcMethod" name="ratioCalcMethod" onChange={this.handleRatioCalculationMethodChange}
                                    style={{display: "inline-block"}}>
                            <FormControlLabel id="ratioCalcMethodRegression" value="ratioCalcMethodRegression"
                                              control={<Radio />} label="Linear regression to burn mid-time" />
                            <FormControlLabel id="ratioCalcMethodAverage" value="ratioCalcMethodAverage"
                                              control={<Radio />} label="Spot average (time-invariant)" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </Grid>
            <Grid item xs={12}>
                <div className="row m-3" style={{marginTop: "20px"}}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Preferred Index Isotope:</FormLabel>
                        <RadioGroup aria-label="IndexIsotope" name="indexIsotope" onChange={this.handlePreferredIndexIsotopeChange}
                                    style={{display: "inline-block"}}>
                            <FormControlLabel id="indexIsotope204" value="PB_204"
                                              control={<Radio />} label="204Pb" />
                            <FormControlLabel id="indexIsotope207" value="PB_207"
                                              control={<Radio />} label="207Pb" />
                            <FormControlLabel id="indexIsotope208" value="PB_208"
                                              control={<Radio />} label="208Pb" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </Grid>



          <div className="row justify-content-center m-2" style={{marginTop: "20px"}}>
            <Button variant="outlined" color="primary" size="large"
              onClick={this.handleUpload}
            >
              Click here to Upload data for processing ... wait for returned
              results
            </Button>
          </div>
            <div className="row justify-content-center text-center text-danger m-2" style={{marginTop: "5px"}}>
                Note: parameter models are currently GA defaults (see Squid app).
            </div>

          <h4 className="mt-4">
              <div>
              Visit us on&nbsp;
                <a href="https://github.com/CIRDLES/Squid" target="_blank">
                  Github
                </a>
              </div>
          </h4>
        </div>
      </Box>
              </Grid>
          </div>
      </Fragment>
    );
  }

/* 
 function shortenFileName(fileName) {
  return (fileName && fileName.length > 50) ? (fileName.substring(0, 47) + "...") : fileName;
} */
 
/* function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    createProject: bindActionCreators(createProject, dispatch)
  };
} */
}
export default SquidPage;
