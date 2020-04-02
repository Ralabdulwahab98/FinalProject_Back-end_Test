const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const cors = require("cors");

const passport = require("passport");
const path = require("path");


require("dotenv/config");



// require route files
const customerRoute = require("./app/routes/customer");
const serviceRoute = require("./app/routes/service");


// require database configuration logic
const db = require('./config/db');


// Define Ports
const reactPort = 3000
const expressPort = 5000

// establish database connection
mongoose.Promise = global.Promise
mongoose.connect(db.currentDB,
  { useNewUrlParser: true }
)


// instantiate express application object
const app = express()


// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${reactPort}`}))

// define port for API to run on
const port = process.env.PORT || expressPort

// add `bodyParser` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express applicationapp.use(bodyParser.json());
app.use(bodyParser.json())

// this parses requests sent by `$.ajax`, which use a different content type
app.use(bodyParser.urlencoded({ extended: true }))


app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
  next();
});



// const checkUserType = function (req, res, next) {
//   const userType = req.originalUrl.split('/')[2];
//   console.log(userType)
//   // Bring in the passport authentication
//   require('./config/passport')(userType, passport);
//   next();
// };



// Handler for Error 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendFile(path.join(__dirname, "../public/500.html"));
});


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('enjaz-front-end/build'));
}
// app.use(checkUserType);

app.use(customerRoute);
// app.use("/api/admin", adminRoute);
app.use(serviceRoute);
// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
  res.status(404).send("We think you are lost!");
});

app.listen(port, () => {
  console.log(`("===== HERE WE END ====="LISTENING to http://localhost:${port}`);
});

// needed for testing
module.exports = app