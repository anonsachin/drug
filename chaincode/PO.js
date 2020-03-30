'use strict';

class Porder{
  constructor(poObject){
    Object.assign(this,poObject);
  }
  static getClass(){
    return 'org.drug-network.pharmanet.model.PO';
  }
  static fromBuffer(buffer){
    let json = JSON.parse(buffer.toString());
    return new Porder(json);
  }
  toBuffer(){
    return Buffer.from(JSON.stringify(this));
  }

  static createInstance(poObject){
    return new Porder(poObject);
  }
}


module.exports = Porder;
