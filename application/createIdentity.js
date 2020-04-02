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

main('/home/upgrad/drug/network/crypto-config/peerOrganizations/manufacturer.drug-network.com/users/Admin@manufacturer.drug-network.com/msp/signcerts/Admin@manufacturer.drug-network.com-cert.pem','/home/upgrad/drug/network/crypto-config/peerOrganizations/manufacturer.drug-network.com/users/Admin@manufacturer.drug-network.com/msp/keystore/9775d4330cd44263b2790c4f6fb003b3095fa2c5e4bd4494cf8fbfc708ed6009_sk').then(() =>{
  console.log("Identity created!!!");
})

module.exports.run = main;
