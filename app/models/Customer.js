const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');



const Schema = mongoose.Schema;

const CustomerSchema = mongoose.Schema({

  FullName: {
    type: String,
    required: [true, 'customer Full Name required']
  },
  Email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
    required: [true, 'customer email  required']
  },
  Username: {
    type: String,
    unique: true,
    required: [true, 'customer Username required']
  },
  password: {
    type: String,
    required: [true, 'customer Password required']
  },
  Phone: {
    type: String,
    minlength: [10, 'Pease inter correct phone number'],
    maxlength: [10, 'Pease inter correct phone number'],
    required: [true, 'customer phone number required']
  },
  RequestService: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Service'
    }
  ],
  ReceivedService: [
    {
      type: Schema.Types.ObjectId,
      ref: 'service'
    }
  ],
  Worker: {
    type: Boolean,
    default: false
  }
});

CustomerSchema.plugin(uniqueValidator);

const Customer = module.exports = mongoose.model('Customer', CustomerSchema);


// create and export function to  Find the Employee by ID
module.exports.getUserById =  (id, callback) =>{
    Customer.findById(id, callback);
}

//create and export function to  Find the Employee by Its username
module.exports.getUserByUsername =  (Username, callback) =>{
    const query = {
      Username: Username
    }
    Customer.findOne(query, callback);
}

// create and export function to Register the Employee
module.exports.addUser =   (newEmp, callback) =>{
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newEmp.password, salt, (err, hash) => {
            if (err) throw err;
            newEmp.password = hash;
            newEmp.save(callback);
        })
    });
}

//create and export function to  Compare the  Password
module.exports.comparePassword =  (password, hash, callback) =>{
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}




