const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ServiceSchema = mongoose.Schema({
  ServiceDescription: {
    type: String,
    required: [true, 'Service Description required']
  },
  ServiceState: {
    type: String,
    required: [true, 'Service State required'],
    enum:['Open', 'On Progress','Closed']
  },
  ServicesEmp: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    }
  ],
  Rating:
  {
    type: Number, min: 0, max: 5
  },
  ServiceType:{
    type: String,
    required: [true, 'WorkerType is required'],
    enum:["Electrician","Plumber","Painter","Carpenter"]
  }
  
});
module.exports = mongoose.model('Service', ServiceSchema)