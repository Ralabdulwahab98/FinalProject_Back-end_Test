const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const serviceSchema = mongoose.Schema({
  ServiceType: {
    type: String,
    required: [true, 'Service Type  required']
  },
  ServiceDescription: {
    type: String,
    required: [true, 'Service Description required']
  },
  ServiceState: {
    type: String,
    required: [true, 'Service State required'],
    enum: ['Open', 'On Progress', 'closed']
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
  }
  
});
module.exports = mongoose.model('Service', serviceSchema)