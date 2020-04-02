const mongoose = require('mongoose');
const db = require('./db');
require('dotenv/config');

mongoose.set('useCreateIndex', true);
const cdb = db.currentDB
const connectDB = async () => {
  await  mongoose.connect(
    cdb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log('=========the connection with mongodb is ESTABLISHED=======',cdb);
    }
  );}
  
module.exports = connectDB;