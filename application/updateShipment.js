'use strict';

const gateway = require('./connectGateway.js');
const contract_Name = 'org.drug-network.pharmanet.transfer';

async function main(org,buyerCRN,drugName,transporterCRN) {
  try {

    console.log('Starting');
    const contract = await gateway.getContractInstance(org,contract_Name);

    //  Creating a new company
    console.log('Creating a company');
    const buffer = await contract.submitTransaction('updateShipment',buyerCRN,drugName,transporterCRN);

    // process the output
    console.log("The response is ====> \n");
    let shipment = JSON.parse(buffer.toString());
    console.log(shipment);

    return shipment;

  } catch (e) {
    console.log("THE ERROR IS = "+e);
    console.log(e.stack);
    throw new Error(e);
  } finally {
    console.log("Disconnecting...");
    gateway.disconnect();
  }
}

// main("manufacturer","CRN001","asprin","CRN003").then(()=>{
//   console.log("shipment is created !!");
// })

module.exports.run = main;
