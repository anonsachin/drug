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

let pKey = '/home/upgrad/drug/network/crypto-config/peerOrganizations/manufacturer.drug-network.com/users/Admin@manufacturer.drug-network.com/msp/keystore/0930ea91c10438a21cef72c6e480cb130f70d8b240a85cf9f67a8d96678f7cda_sk'

main('/home/upgrad/drug/network/crypto-config/peerOrganizations/manufacturer.drug-network.com/users/Admin@manufacturer.drug-network.com/msp/signcerts/Admin@manufacturer.drug-network.com-cert.pem',pKey).then(() =>{
  console.log("Identity created!!!");
})

module.exports.run = main;
