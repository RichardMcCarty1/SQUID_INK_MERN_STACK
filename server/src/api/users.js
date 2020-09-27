const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const multer = require("multer");
const { mongo, connection } = require('mongoose');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
Grid.mongo = mongo;
const crypto = require('crypto');
const path = require('path');
const app = express();

let userIdForFiles;

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../src/models/User");


//Load Upload model
const Upload = require("../../src/models/Upload");

app.set('view engine', 'ejs');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
        userIdForFiles = user.id

        // get token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            // 1 year, in seconds
            expiresIn: 31556926
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password is incorrect" });
      }
    });
  });
});

/*DB Connect and file retrieval flow
  Methods for incorporating into get request:
  1. Run the mongoClient.connect full function within router.get, send request within MongoClient.connect to maintain asynchronicity
      **Not very efficient, reforms connection on every request
  2. Package mongoClient as async function, call within get to retrieve files to send, requires async layout, cross-check with router. Will send out a promise
      if not resolved effectively, likely error out.
  3. Consolidate client to constant, pass client to register db instance, pull from db instance every time
      **Have to manage promise to const initialization, see how client.connect interacts without being closed, if instance remains or is closed at function end
      **Maybe callback function to assign mongoclient final val?? How to move var from function scope to full scope??
 */
const dbs = require("../../config/keys").mongoURI;

//gfs.collection('uploads');
// @route http://localhost:5000/api/users/upload
// @desc create storange engine

const storage = new GridFsStorage({
  url: dbs,
  file: (req, file) => {

    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          metadata: userIdForFiles,
          bucketName: 'useruploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

const singleUpload = multer({ storage: storage }).single('file');

router.get('/files/:id', (req, res) => {
  MongoClient.connect(dbs, function (err, client) {
    const notAdmin = client.db("upload_db");
    notAdmin.collection("useruploads.files").find({metadata: req.param('id')}).toArray().then(value => {
      client.close();
      return res.json(value)
  });
});
});

router.get('/files', (req, res) => {
  MongoClient.connect(dbs, function (err, client) {
    const notAdmin = client.db("upload_db");
    notAdmin.collection("useruploads.files").find({metadata: userIdForFiles}).toArray().then(value => {
      client.close();
      console.log(value)
      return res.json(value)
    });
  });
});


router.post('/files', singleUpload, (req, res) => {
  if (req.file) {
    return res.json({
      success: true,
      file: req.file
    });

  }
  res.send({ success: false });
});

router.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id }, (err) => {
    if (err) return res.status(500).json({ success: false })
    return res.json({ success: true });
  });
});



module.exports = router;
