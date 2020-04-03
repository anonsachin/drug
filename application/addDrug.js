'use strict';

const gateway = require('./connectGateway.js');
const contract_Name = 'org.drug-network.pharmanet.manufacturer';

async function main(org,drugName, serialNo, mfgDate, expDate, companyCRN) {
  try {

    console.log('Starting');
    const contract = await gateway.getContractInstance(org,contract_Name);

    //  Creating a new company
    console.log('Creating a company');
    const buffer = await contract.submitTransaction('addDrug',drugName, serialNo, mfgDate, expDate, companyCRN);

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

main("manufacturer","asprin","sn001","12/02/2020","12/08/2020","CRN002").then(()=>{
  console.log("Drug has been added !!");
});
//
// main("manufacturer","asprin","sn002","12/02/2020","12/08/2020","CRN002").then(()=>{
//   console.log("Drug has been added !!");
// });


module.exports.run = main;
