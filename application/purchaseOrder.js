'use strict';

const gateway = require('./connectGateway.js');
const contract_Name = 'org.drug-network.pharmanet.transfer';

async function main(org,buyerCRN,sellerCRN,drugName,quantity) {
  try {

    console.log('Starting');
    const contract = await gateway.getContractInstance(org,contract_Name);

    //  Creating a new company
    console.log('Creating a company');
    const buffer = await contract.submitTransaction('createPO',buyerCRN,sellerCRN,drugName,quantity);

    // process the output
    console.log("The response is ====> \n");
    let po = JSON.parse(buffer.toString());
    console.log(po);

    return po;

  } catch (e) {
    console.log("THE ERROR IS = "+e);
    console.log(e.stack);
    throw new Error(e);
  } finally {
    console.log("Disconnecting...");
    gateway.disconnect();
  }
}

// main("manufacturer","CRN001","CRN002","asprin","2").then(()=>{
//   console.log("Purchase order placed!!");
// })

module.exports.run = main;
