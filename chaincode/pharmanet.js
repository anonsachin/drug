'use strict';

const {Contract} = require('fabric-contract-api');
const Company = require('./Company.js');
const Drug = require('./Drug.js');

class Pharmanet extends Contract{

  constructor(){
    super('org.drug-network.pharmanet.common');
  }

  async instantiate(ctx){
    console.log('Pharmanet is up !!!!');
  }

  async registerCompany (ctx,companyCRN, companyName, location, organisationRole){
    //  evaluating hierarchy
    let hierarchyKey = null;
    switch (organisationRole) {
      case 'Manufacturer':
        hierarchyKey =1;
        break;
      case 'Distributor':
        hierarchyKey =2;
        break;
      case 'Retailer':
        hierarchyKey =3
        break;
      default:
        hierarchyKey = null;
    }
    // creating companyKey
    let companyKey = ctx.stub.createCompositeKey(Company.getClass(),[companyCRN,companyName]);
    // creating json
    let company = {
      companyID: companyKey,
      name: companyName,
      location: location,
      organisationRole: organisationRole,
      hierarchyKey: hierarchyKey
    };
    // creating instance
    let companyObject = Company.createInstance(company);
    // storing on the ledger
    await ctx.stub.putState(companyKey,companyObject.toBuffer());

    return companyObject;
  }

  async getHistory(ctx,drugName,serialNo){
    //  key
    let drugKey = ctx.stub.createCompositeKey(Drug.getClass(),[drugName+'-'+serialNo]);
    let iterator = await ctx.stub.getHistoryForKey(companyKey);
    let result = await getAllResults(iterator);
    return result;
  }

}

// helper fuunction from fabric documentation
async function getAllResults(iterator) {
  console.log("inside iterator");
  const allResults = [];
  while (true) {
      const res = await iterator.next();
      console.log(res);
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

module.exports = Pharmanet;
