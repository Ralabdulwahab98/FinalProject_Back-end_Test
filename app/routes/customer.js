const express = require('express');
const router = express.Router();
const passport = require('passport');
// const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const config = require('../../config/db');

require("dotenv").config();


router.post('/api/customer/register', (req, res) => {
    const { FullName, Username, Email, password, Phone,Worker } = req.body;
    const customer = {}
    customer.FullName = FullName,
        customer.Username = Username,
        customer.Email = Email + '@enjaz.com',
        customer.Phone = Phone,
        customer.password = password,
        customer.admin = admin
    let newCustomer = new Customer(customer)

    Customer.addUser(newCustomer, (err, customer) => {
        if (err) {
            let message = "";
            if (err.errors.Username) message = "Username is already exist. ";
            if (err.errors.Email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "Customer registration is successful."
            });
        }
    });
});




router.post('/api/customer/login', (req, res) => {
    const Username = req.body.Username;
    const password = req.body.password;

    Customer.getUserByUsername(Username, (err, customer) => {
        if (err) throw err;
        if (!customer) {
            return res.json({
                success: false,
                message: "Customer not found."
            });
        }

        Customer.comparePassword(password, customer.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "customer",
                    data: {
                        _id: customer._id,
                        Username: customer.Username,
                        FullName: customer.FullName,
                        Email: customer.email,
                        Phone: customer.Phone,
                        admin: customer.admin
                    }
                }, config.database.secret, {
                    expiresIn: 36000000 // for 10 Hou time in seconds
                });
                console.log(token);
                return res.json({
                    success: true,
                    token: "jwt " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});


//  Get Authenticated user profile
 

router.get('/api/customer/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    console.log(`customer login success ${req.user}`);
    return res.json(
        req.user
    );
}

);
//-------------Get ALl Customer RequestService By Customer ID-------------------

router.get('/api/customer/RequestService/:CustomerId', (req, res) => {
    Customer.findById(req.params.CustomerId)
    .populate('RequestService') 
    .exec( (err, oneCustomer) =>{
      if (err) return res.status(404).json(err);
      console.log('Services',oneCustomer);
      res.send(oneCustomer.RequestService)
        });

      });
  
//-------------Get ALl Customer ReceivedService By Customer ID-------------------

router.get('/api/customer/ReceivedService/:CustomerId', (req, res) => {
    Customer.findById(req.params.CustomerId)
    .populate('ReceivedService') 
    .exec( (err, oneCustomer) =>{
      if (err) return res.status(404).json(err);
      console.log('Services',oneCustomer);
      res.send(oneCustomer.ReceivedService)
        });

      });
module.exports = router;
