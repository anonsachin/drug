'use strict';

const gateway = require('./connectGateway.js');
const contract_Name = 'org.drug-network.pharmanet.common';

async function main(org,companyCRN, companyName, location, organisationRole) {
  try {
    
    console.log('Starting');
    const contract = await gateway.getContractInstance(org,contract_Name);

    //  Creating a new company
    console.log('Creating a company');
    const companyBuffer = await contract.submitTransaction('registerCompany',companyCRN, companyName, location, organisationRole);

    // process the output
    console.log("The response is ====> \n");
    let company = JSON.parse(companyBuffer.toString());
    console.log(company);

    return company;

  } catch (e) {
    console.log("THE ERROR IS = "+e);
    console.log(e.stack);
    throw new Error(e);
  } finally {
    console.log("Disconnecting...");
    gateway.disconnect();
  }
}

// main('manufacturer','CRN001','amazon','Bangalore','Distributor').then(()=>{
//   console.log("created a company!!");
// });

// main('manufacturer','CRN002','flipkart','Bangalore','Manufacturer').then(()=>{
//   console.log("created a company!!");
// });

// main("manufacturer","CRN003","Fedex","Bangalore","Transporter").then(()=>{
//   console.log("created a company!!");
// });

module.exports.run = main;
