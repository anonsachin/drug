'use strict';

class Drug{
  constructor(drugObject){
    Object.assign(this,drugObject);
  }

  static getClass(){
    return 'org.drug-network.pharmanet.model.Drug';
  }
  static fromBuffer(buffer){
    let json = JSON.parse(buffer.toString());
    return new Drug(json);
  }
  toBuffer(){
    return Buffer.from(JSON.stringify(this));
  }

  static createInstance(drugObject){
    return new Drug(drugObject);
  }
}

module.exports = Drug;
