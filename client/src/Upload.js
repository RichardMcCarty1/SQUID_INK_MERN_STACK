import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import './Upload.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileInfo: [],
      files: [],
      file: ''
    }
    this.loadFiles = this.loadFiles.bind(this);
  }
  componentDidMount() {
    this.loadFiles();
  }
  loadFiles() {
    fetch('/api/users/files')
      .then(res => res.json())
      .then(files => {
        if (files.message) {
          console.log('No Files');
          this.setState({ files: [] })
        } else {
          this.setState({ files })
        }
      });
  }
  fileChanged(event) {
    const f = event.target.files[0];
    this.setState({
      file: f
    });
  }



  deleteFile(event) {
    event.preventDefault();
    const id = event.target.id;
    fetch('/api/users/files' + id, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(response => {
        console.log(response);
        if (response.success) this.loadFiles()
        else alert('Delete Failed');
      })
  }
  uploadFile(event) {
    event.preventDefault();
    let data = new FormData();
    data.append('file', this.state.file);

    let arr = this.state.fileInfo;
    arr.push(this.state.file);

    // add to fileInfo array to display below upload...
    this.setState({
      fileInfo: arr
    });
    fetch('/api/users/files', {
      method: 'POST',
      body: data
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          this.loadFiles();
        } else {
          alert('Upload failed');
        }
      });
  }
  render() {
    const { files } = this.state;
    return (
      <div className="Upload">
        <header className="Upload-header">
          <h5 className="Upload-title"></h5>
        </header>
        <div className="Upload-content">
          <input type="file" onChange={this.fileChanged.bind(this)} />
          <button onClick={this.uploadFile.bind(this)}>Upload</button>
          <table className="Upload-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Uploaded</th>
                <th>Size</th>

              </tr>
            </thead>
            {/*`${dateUpload.toLocaleDateString()} ${dateUpload.toLocaleTimeString()}`*/}
            <tbody>
              {this.state.fileInfo.map((file, index) => {
                const dateUpload = new Date(file.uploadDate);
                console.log(this.state.fileInfo)
                return (
                  <tr key={index}>
                    <td><a href={`http://localhost:5000/api/users/files/${file.id}`}>{file.id}</a></td>
                    <td>{file.name}</td>
                    <td>{(Math.round(file.size / 100) / 10) + 'KB'}</td>
                    <td><button onClick={() => {
                      this.deleteFile.bind(this)
                      let arr = this.state.fileInfo;
                      arr.splice(index, 1);
                      this.setState({
                        fileInfo: arr
                      })
                    }} id={file._id}>Remove</button></td>
                  </tr>
                )
              })}
            </tbody>

          </table>
          {/* <div className="fileRenders">
            <h3 class="ui header" style={{ float: "right" }}>
              {this.state.fileInfo.map((file) => (
                <p>{file.name} Successful {file.size}</p>
              ))}
            </h3>
          </div> */}
        </div>
      </div>
    );
  }
}


export default Upload; 