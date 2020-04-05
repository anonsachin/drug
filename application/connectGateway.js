'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
let gateway;

async function getContractInstance(org,contractName){
  gateway = new Gateway()

  const wallet = new FileSystemWallet('./identity/'+org);

  const fabricUserName = org+'_admin';
  let connectionProfile = null;
  console.log('getting yaml');
  switch (org) {
    case 'manufacturer':
      connectionProfile = yaml.safeLoad(fs.readFileSync('./commonConnectionProfileMan.yaml','utf8'));
      break;
    case 'distributor':
      connectionProfile = yaml.safeLoad(fs.readFileSync('./commonConnectionProfileDis.yaml','utf8'));
      break;
    case 'transporter':
      connectionProfile = yaml.safeLoad(fs.readFileSync('./commonConnectionProfileTran.yaml','utf8'));
      break;
    case 'retailer':
      connectionProfile = yaml.safeLoad(fs.readFileSync('./commonConnectionProfileRet.yaml','utf8'));
      break;
    case 'consumer':
      connectionProfile = yaml.safeLoad(fs.readFileSync('./commonConnectionProfileCon.yaml','utf8'));
      break;
    default:
      throw new Error('Not a valid organization');
  }
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

function disconnect(){
  console.log("Disconnecting...");
  gateway.disconnect();
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;
