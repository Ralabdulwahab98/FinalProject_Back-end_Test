const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Service = require('../models/Service');
//-------------create service embedded in customer-------------------
router.post('/api/:customerId', (req, res) => {
  // store new Service in memory with data from request body
  const { ServiceType, ServiceDescription, ServiceState } = req.body
  let service = {}
    service.ServiceType = ServiceType,
    service.ServiceDescription = ServiceDescription,
    service.ServiceState = ServiceState,
    service.RequestService = req.params.customerId
  const savedService = new Service(service)
  savedService.save()
  // find Customer in db by id and add new service
 Customer.findById(req.params.customerId, async (error, foundCustomer) => {
    try {
      await foundCustomer.RequestService.push(savedService);
      foundCustomer.save()
      res.status(200).json(savedService);
    }
    catch (error) {
      res.status(404).json(error);
    }
  });
});


//-------------Get all service-------------------
router.get('/api/service/allServices', (req, res) => {
    Service.find({})
  .populate('ServicesEmp')
  .exec((err, Customer) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    console.log(`customer login success ${req.user}`);
    console.log(`found and populated all : ${Customer}`);
    res.json(Customer);
  });
});
//-------------Pass service to another Customer-------------------
router.patch('/api/PassService/:ServiceId', (req, res) => {
    Service.findById(req.params.ServiceId, async (error, foundService) => {
    try {
      await foundService.ServicesEmp.push(req.body.ServicesEmp);
    } catch (error) {
      res.status(404).json(error);
    }
    Customer.findById(req.body.ServicesEmp, async (error, foundService) => {
      try {
        await foundService.save()
        foundService.ReceivedService.push(foundService);
        foundService.save()
        res.status(200).json(foundService.ServicesEmp);
      } catch (error) {
        res.status(404).json(error);
      }
    })
  });
});
//-------------Update Service by Service Id-------------------
router.patch('/api/UpdateService/:ServiceId', (req, res) => {
  Service.findById(req.params.ServiceId, async (error, foundService) => {
    try {
      await foundService.update(req.body);
      res.status(200).json(req.body);
    } catch (error) {
      res.status(404).json(error);
    }
  });
});
//-------------Delete Service by Service Id-------------------
router.delete('/api/DeleteService/:ServiceId', (req, res) => {
  Service.findById(req.params.ServiceId, async (error, foundService) => {
    try {
      await foundService.remove();
      res.status(200).json( `Service Id:  ${req.params.ServiceId} has been deleted `);
    } catch (error) {
      res.status(404).json({ error:{
        name: 'DocumentNotFound',
        massage:'The provided ID dose not match any Document on Service'
    } });
    }
  });
});
module.exports = router
