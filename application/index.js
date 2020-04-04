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

app.listen(port, () => console.log("Counterfeit Drug Detection App listening ..."));
