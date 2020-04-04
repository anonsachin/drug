'use strict';

const gateway = require('./connectGateway.js');
const contract_Name = 'org.drug-network.pharmanet.common';

async function main(org,drugName,serialNo) {
  try {

    console.log('Starting');
    const contract = await gateway.getContractInstance(org,contract_Name);

    //  Creating a new company
    console.log('Creating a company');
    const buffer = await contract.submitTransaction('viewDrugCurrentState',drugName,serialNo);

    // process the output
    console.log("The response is ====> \n");
    let drug = JSON.parse(buffer.toString());
    console.log(drug);

    return drug;

  } catch (e) {
    console.log("THE ERROR IS = "+e);
    console.log(e.stack);
    throw new Error(e);
  } finally {
    console.log("Disconnecting...");
    gateway.disconnect();
  }
}

// main("manufacturer","asprin","sn001").then(()=>{
//   console.log("Current state retrieved!!!");
// });
// main("manufacturer","asprin","sn002").then(()=>{
//   console.log("Current state retrieved!!!");
// });

module.exports.run = main;
