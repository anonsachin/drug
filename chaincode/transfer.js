'use strict';

const {Contract} = require('fabric-contract-api');
const Drug = require('./Drug.js');
const Company = require('./Company.js');
const Po = require('./PO.js');

class Transfer extends Contract {
  constructor() {
    super('org.drug-network.pharmanet.transfer');
  }
  async createPO(ctx,buyerCRN,sellerCRN,drugName,quantity){
    try {
      // validation
      let msp = ctx.clientIdentity.getMSPID();
      // if( msp === 'distributorMSP' )

      // Getting the buyer
      let iterator_buy = await ctx.stub.getStateByPartialCompositeKey(Company.getClass(),[buyerCRN]);
      let buyer = await getAllResults(iterator_buy);
      let buyerObject = JSON.parse(buyer[0]);

      // Getting the seller
      let iterator_sell = await ctx.stub.getStateByPartialCompositeKey(Company.getClass(),[sellerCRN]);
      let seller  = await getAllResults(iterator_sell);
      let sellerObject = JSON.parse(seller[0]);
      if(buyerObject.hierarchyKey !== (sellerObject.hierarchyKey+1)){
        throw new Error("The hierarchy of the buyer and seller arent accurate");
      }

      // key
      let pokey = ctx.stub.createCompositeKey(Po.getClass(),[buyerCRN,drugName]);
      // order
      let purchase = {
        poID: pokey,
        drugName: drugName,
        quantity: quantity,
        buyer: buyerObject.companyID,
        seller: sellerObject.companyID
      }
      let purchaseOrder = Po.createInstance(purchase);

      // storing the purchase order
      await ctx.stub.putState(pokey,purchaseOrder.toBuffer());

      return purchaseOrder;
    } catch (e) {
      console.log("This is the Error :"+e);
      console.log(e.stack);
    }
  }
}

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

module.exports = Transfer;
