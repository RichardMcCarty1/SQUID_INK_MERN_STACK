import React, { Component } from "react";
import { connect } from "react-redux";
import LinkButton from "./authActions";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";


class MyFiles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      file: ''
    }
    this.loadFiles = this.loadFiles.bind(this);
  }
  componentDidMount() {
    this.loadFiles();
  }
  loadFiles()
  {const { user } = this.props.auth;
    fetch(`http://localhost:5000/api/users/files/${user.id}`)
      .then(res => res.json())
      .then(files => {
        console.log(files);
        if (files.message) {
          console.log('No Files');
          this.setState({ files: [] })
        } else {
          this.setState({ files })
        } 
      });
  }
  
  
    render() {
      const { files } = this.state;
      const { user } = this.props.auth;
      console.log(files);
      return (
        <div style={{ height: "75vh" }} className="container valign-wrapper">
          <Grid container
                justify="center"
                spacing={12}
          >
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">File Name</TableCell>
                      <TableCell align="center">Uploaded Date</TableCell>
                      <TableCell align="center">Size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.map((file, index) => {
                      return (
                          <TableRow key={file.index}>
                            <TableCell align="center">
                              {file.filename}
                            </TableCell>
                            <TableCell align="center">
                              {file.uploadDate}
                            </TableCell>
                            <TableCell align="center">
                              {(Math.round(file.length/100) / 10)+'KB'}
                            </TableCell>
                          </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      );
    }


    
  }
  
 
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps,
    {}
  )(MyFiles);
  
  