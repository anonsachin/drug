'use strict';

class Shipement{
  constructor(shipment) {
    Object.assign(this,shipment);
  }

  static getClass(){
    return 'org.drug-network.pharmanet.model.Shipement'
  }

  static fromBuffer(buffer){
    let json = JSON.parse(buffer.toString());
    return new Shipement(json);
  }

  toBuffer(){
    return Buffer.from(JSON.stringify(this));
  }

  static createInstance(shipment){
    return new Shipement(shipment);
  }

}

module.exports = Shipement;
