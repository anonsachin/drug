const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// get the modules
const createIdentity = require('./createIdentity.js');
const addDrug = require('./addDrug.js');
const addCompany = require('./addCompany.js');
const purchaseOrder = require('./purchaseOrder.js');
const createShipment = require('./createShipment.js');
const updateShipment = require('./updateShipment.js');
const retailDrug = require('./retailDrug.js');
const drugCurrentState =require('./drugCurrentState.js');
const history = require('./history.js');

// server
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('title','Counterfeit Drug Detection');

app.get('/',(req,res) => res.send('Counterfeit Drug Detection Server UP!!'));

app.post('/createIdentity',(req,res) => {
  createIdentity.run(req.body.org,req.body.certificatePath,req.body.privateKeyPath)
      .then(() => {
        console.log('User wallet created');
        const result = {
          status: 'success',
          message: 'User wallet created'
        };
        res.json(result);
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        };
        res.status(500).send(result)
      });
});

app.post('/addCompany',(req,res) => {
  addCompany.run(req.body.org,req.body.companyCRN,req.body.companyName,req.body.location,req.body.organisationRole)
      .then((company) =>{
        console.log("The company was created");
        const result = {
          status: 'success',
          message: 'Company created',
          company: company
        }
        res.json(result)
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        }
        res.status(500).send(result);
      });
});

app.post('/addDrug',(req,res) => {
  addDrug.run(req.body.org,req.body.drugName,req.body.serialNo,req.body.mfgDate,req.body.expDate,req.body.companyCRN)
      .then((drug) =>{
        console.log("The drug was created");
        const result = {
          status: 'success',
          message: 'Company created',
          drug: drug
        }
        res.json(result)
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        }
        res.status(500).send(result);
      });
});

app.post('/purchaseOrder',(req,res) => {
  purchaseOrder.run(req.body.org,req.body.buyerCRN,req.body.sellerCRN,req.body.drugName,req.body.quantity)
      .then((po) =>{
        console.log("The order was created");
        const result = {
          status: 'success',
          message: 'Company created',
          purchaseOrder: po
        }
        res.json(result)
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        }
        res.status(500).send(result);
      });
});

app.post('/createShipment',(req,res) => {
  createShipment.run(req.body.org,req.body.buyerCRN,req.body.drugName,req.body.listOfAssets,req.body.transporterCRN)
      .then((shipment) =>{
        console.log("The shipment was created");
        const result = {
          status: 'success',
          message: 'Company created',
          shipment: shipment
        }
        res.json(result)
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        }
        res.status(500).send(result);
      });
});

app.post('/updateShipment',(req,res) => {
  updateShipment.run(req.body.org,req.body.buyerCRN,req.body.drugName,req.body.transporterCRN)
      .then((shipment) =>{
        console.log("The shipment was updated");
        const result = {
          status: 'success',
          message: 'Company created',
          shipment: shipment
        }
        res.json(result)
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        }
        res.status(500).send(result);
      });
});

app.post('/drugCurrentState',(req,res) => {
  drugCurrentState.run(req.body.org,req.body.drugName,req.body.serialNo)
      .then((drug) =>{
        console.log("The drug state");
        const result = {
          status: 'success',
          message: 'Company created',
          drug: drug
        }
        res.json(result)
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        }
        res.status(500).send(result);
      });
});

app.post('/drugHistory',(req,res) => {
  history.run(req.body.org,req.body.drugName,req.body.serialNo)
      .then((drug) =>{
        console.log("The drug history");
        const result = {
          status: 'success',
          message: 'Company created',
          drug: drug
        }
        res.json(result)
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        }
        res.status(500).send(result);
      });
});

app.post('/retailDrug',(req,res) => {
  retailDrug.run(req.body.org,req.body.drugName,req.body.serialNo,req.body.retailerCRN,req.body.customerAadhar)
      .then((drug) =>{
        console.log("The company was created");
        const result = {
          status: 'success',
          message: 'Company created',
          drug: drug
        }
        res.json(result)
      })
      .catch((e) => {
        const result = {
          status: 'error',
          message: 'Failed',
          error: e
        }
        res.status(500).send(result);
      });
});

app.listen(port, () => console.log("Counterfeit Drug Detection App listening ..."));
