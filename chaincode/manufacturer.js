'use strict';

const {Contract} = require('fabric-contract-api');
const Drug = require('./Drug.js');
const Company = require('./Company.js');

class Manufacturer extends Contract {

  constructor(){
    super('org.drug-network.pharmanet.manufacturer');
  }

  async addDrug(ctx,drugName, serialNo, mfgDate, expDate, companyCRN){
    try {
      // validation
      let msp = ctx.clientIdentity.getMSPID();
      if (msp !== 'manufacturerMSP'){
        throw new Error("THIS IS ONLY FOR Manufacturers");
      }
      //  key
      let drugKey = ctx.stub.createCompositeKey(Drug.getClass(),[drugName+'-'+serialNo]);

      //  getting the manufacturer
      let iterator = await ctx.stub.getStateByPartialCompositeKey(Company.getClass(),[companyCRN]);
      let results = await getAllResults(iterator);
      //  extracting company
      let company = JSON.parse(results[0])
      let man = company.companyID;
      // drug
      let drug = {
        productID: drugKey,
        name: drugName,
        manufacturer: man,
        manufacturingDate:mfgDate,
        expiaryDate: expDate,
        owner: man,
        shipment: []
      };
      console.log(drug);
      let drugObject = Drug.createInstance(drug);
      console.log(drugObject);
      // storing on blockchain
      await ctx.stub.putState(Drug.getClass(),drugObject.toBuffer());

      return drugObject;

    } catch (e) {
      console.log("This is the error:"+e);
      console.log(e.stack);
    }
  }

}

// helper fuunction from fabric documentation
async function getAllResults(iterator) {
  console.log("inside iterator");
  const allResults = [];
  while (true) {
      const res = await iterator.next();
      if (res.value) {
          // if not a getHistoryForKey iterator then key is contained in res.value.key
          allResults.push(res.value.value.toString('utf8'));
      }

      // check to see if we have reached then end
      if (res.done) {
          // explicitly close the iterator
          await iterator.close();
          return allResults;
      }
  }
}

module.exports = Manufacturer;
