'use strict';

const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');

const wallet = new FileSystemWallet('./identity/manufacturer');

async function main(certificatePath, privateKeyPath){
  try {

    // reading the required files
    const certificate = fs.readFileSync(certificatePath).toString();
    const privatekey = fs.readFileSync(privateKeyPath).toString();

    const identityLabel = 'manufacturer_admin';
    const identity = X509WalletMixin.createIdentity('manufacturerMSP',certificate,privatekey);

    await wallet.import(identityLabel, identity);

  } catch (e) {
    console.log("THE ERROR IS = "+e);
    console.log(e.stack);
    throw new Error(e);
  }
}

main('/home/upgrad/drug/network/crypto-config/peerOrganizations/manufacturer.drug-network.com/users/Admin@manufacturer.drug-network.com/msp/signcerts/Admin@manufacturer.drug-network.com-cert.pem','/home/upgrad/drug/network/crypto-config/peerOrganizations/manufacturer.drug-network.com/users/Admin@manufacturer.drug-network.com/msp/keystore/6583dc6087ce7a16568976915f61c9b519b9412a09596e7b4f9d5ca247772a89_sk').then(() =>{
  console.log("Identity created!!!");
})

module.exports.run = main;
