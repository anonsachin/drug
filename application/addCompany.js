'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
let gateway;
const contract_Name = 'org.drug-network.pharmanet.common';

async function main(org,companyCRN, companyName, location, organisationRole) {
  try {

    console.log('Starting');
    const contract = await getContractInstance(org,contract_Name);

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

async function getContractInstance(org,contractName){
  gateway = new Gateway()

  const wallet = new FileSystemWallet('./identity/'+org);

  const fabricUserName = org+'_admin';
  console.log('getting yaml');
  let connectionProfile = yaml.safeLoad(fs.readFileSync('./commonConnectionProfileMan.yaml','utf8'));
  console.log('Creating the options');
  let connectionOptions = {
    wallet: wallet,
    identity: fabricUserName,
    discovery: {enabled: false,asLocalhost: true}
  };

  // connect to gateway
  console.log('Connecting to the network');
  await gateway.connect(connectionProfile,connectionOptions);

  // getting channel
  console.log('Getting the channel');
  const channel = await gateway.getNetwork('pharmachannel');

  // getting the contract
  console.log("getting the contract "+contractName);
  return channel.getContract('pharmanet',contractName);

}

main('manufacturer','CRN001','amazon','Bangalore','Distributor').then(()=>{
  console.log("created a company!!");
});

main('manufacturer','CRN002','flipkart','Bangalore','Manufacturer').then(()=>{
  console.log("created a company!!");
});

module.exports.run = main;
