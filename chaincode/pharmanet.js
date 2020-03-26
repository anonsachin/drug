'use strict';

const {Contract} = require('fabric-contract-api');

class Pharmanet extends Contract{

  constructor(){
    super('org.drug-network.pharmanet.common');
  }

  async instantiate(ctx){
    console.log('Pharmanet is up !!!!');
  }

}

module.exports = Pharmanet;
