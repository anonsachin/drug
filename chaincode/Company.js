'use strict';

class Company{

  constructor(companyObject){
    Object.assign(this,companyObject);
  }

  static getClass(){
    return 'org.drug-network.pharmanet.model.Company'
  }

  static fromBuffer(buffer){
    let json = JSON.parse(buffer.toString());
    return new Company(json);
  }

  toBuffer(){
    return Buffer.from(JSON.stringify(this));
  }

  static createInstance(companyObject){
    return new Company(companyObject);
  }

}

module.exports = Company;
