'use strict';

const gateway = require('./connectGateway.js');
const contract_Name = 'org.drug-network.pharmanet.transfer';

async function main(org,buyerCRN,drugName,listOfAssets,transporterCRN) {
  try {

    console.log('Starting');
    const contract = await gateway.getContractInstance(org,contract_Name);

    // extracting assets
    let assets ={};
    for (var i = 0; i < listOfAssets.length; i++) {
      assets[String(i)] = listOfAssets[i];
    }

    assets['length'] = listOfAssets.length;

    //  Creating a new company
    console.log('Creating a company');
    const buffer = await contract.submitTransaction('createShipment',buyerCRN,drugName,JSON.stringify(assets),transporterCRN);

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

// main("manufacturer","CRN001","asprin",["sn001","sn002"],"CRN003").then(()=>{
//   console.log("shipment is created !!");
// })

module.exports.run = main;
