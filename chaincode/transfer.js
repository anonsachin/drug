'use strict';

const {Contract} = require('fabric-contract-api');
const Drug = require('./Drug.js');
const Company = require('./Company.js');
const Po = require('./PO.js');
const Shipement = require('./Shipment.js')

class Transfer extends Contract {
  constructor() {
    super('org.drug-network.pharmanet.transfer');
  }
  async createPO(ctx,buyerCRN,sellerCRN,drugName,quantity){
    try {
      // validation
      let msp = ctx.clientIdentity.getMSPID();
      if( msp !== 'distributorMSP' && msp !== 'retailerMSP' ){
        throw new Error('Not authorized organization');
      }

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
        quantity: Number(quantity),
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

  async createShipment(ctx,buyerCRN,drugName,listOfAssets,transporterCRN){
    try {
      listOfAssets = JSON.parse(listOfAssets)
      // key
      let pokey = ctx.stub.createCompositeKey(Po.getClass(),[buyerCRN,drugName]);
      // retrieving the order
      let po = await ctx.stub.getState(pokey);
      if(po.toString() === ""){
        throw new Error("This purchase order does'nt exist");
      }
      let order = Po.fromBuffer(po);
      // extracting quantity
      let quantity = Number(order.quantity);
      listOfAssets = JSON.parse(String(listOfAssets));
      // checking length
      if(Number(listOfAssets.length) !== Number(order.quantity)){
        throw new Error("There not enough assets in the list to create shipment");
      }

      // extracting needed elements and creating asset list
      let assets =[]
      let creator = null
      for (var i = 0; i < listOfAssets.length; i++) {
        let assetKey = ctx.stub.createCompositeKey(Drug.getClass(),[drugName,listOfAssets[i]]);
        let asset  = await ctx.stub.getState(assetKey);
        if(asset.toString() === ""){
          throw new Error("INVALID ID at postion :" + i);
        }
        if( i === 0){
          asset = Drug.fromBuffer(asset);
          creator = asset.owner;
        }
        assets.push(assetKey);
      }
      //  getting the transporter
      let iterator = await ctx.stub.getStateByPartialCompositeKey(Company.getClass(),[transporterCRN]);
      let results = await getAllResults(iterator);
      //  extracting company
      let company = JSON.parse(results[0])
      let transporter = company.companyID;
      // key
      let shipmentKey = ctx.stub.createCompositeKey(Shipement.getClass(),[buyerCRN,drugName]);
      // Create Shipement
      let shipment = {
        shipmentID: shipmentKey,
        creator: creator,
        assets: assets,
        transporter: transporter,
        status: "in-transit"
      }
      let shipmentObject = Shipement.createInstance(shipment);
      // storing
      await ctx.stub.putState(shipmentKey,shipmentObject.toBuffer());
      return shipmentObject;
    } catch (e) {
    console.log("This is the error: "+e);
    console.log(e.stack);
    }
  }

  async updateShipment(ctx,buyerCRN,drugName,transporterCRN){
    try {
      // validation
      let msp = ctx.clientIdentity.getMSPID();
      if (msp !== 'transporterMSP'){
        throw new Error('Not authorized organization');
      }
      // shipment key
      let shipmentKey = ctx.stub.createCompositeKey(Shipement.getClass(),[buyerCRN,drugName]);
      // shipment
      let shipment = await ctx.stub.getState(shipmentKey);
      if(shipment.toString() === ""){
        throw new Error("This shipment does'nt exist");
      }
      shipment = Shipement.fromBuffer(shipment);
      //  status changed
      shipment.status = 'delivered';
      // buyer companyKey
      let iterator_buy = await ctx.stub.getStateByPartialCompositeKey(Company.getClass(),[buyerCRN]);
      let buyer = await getAllResults(iterator_buy);
      let buyerObject = JSON.parse(buyer[0]);
      // updating drugs
      let getKey = null;
      let putKey = null;
      let drug = null
      for (var i = 0; i < shipment.assets.length; i++) {
        getKey = ctx.stub.splitCompositeKey(shipment.assets[i]);
        putKey = ctx.stub.createCompositeKey(getKey.objectType,getKey.attributes);
        drug = await ctx.stub.getState(putKey);
        drug = Drug.fromBuffer(drug);
        drug.owner = buyerObject.companyID;
        drug.shipment.push(shipmentKey);
        await ctx.stub.putState(putKey,drug.toBuffer());
      }

      await ctx.stub.putState(shipmentKey,shipment.toBuffer());

      return shipment;

    } catch (e) {
      console.log("This is the error: "+e);
      console.log(e.stack);
    }
  }

  async retailDrug(ctx,drugName,serialNo,retailerCRN,customerAadhar){
    try {
      // validation
      let msp = ctx.clientIdentity.getMSPID();
      if (msp !== 'retailerMSP'){
        throw new Error('Not authorized organization');
      }
      // drug key
      let drugKey = ctx.stub.createCompositeKey(Drug.getClass(),[drugName,serialNo]);
      let drug  = await ctx.stub.getState(drugKey);
      drug = Drug.fromBuffer(drug);
      // Retailer companyKey
      let iterator_retail = await ctx.stub.getStateByPartialCompositeKey(Company.getClass(),[retailerCRN]);
      let retail = await getAllResults(iterator_retail);
      let retailObject = JSON.parse(retail[0]);
      if(drug.owner !== retailObject.companyID){
        throw new Error("Not the owner");
      }
      //  owner changed
      drug.owner = customerAadhar;
      await ctx.stub.putState(drugKey,drug.toBuffer());

      return drug;

    } catch (e) {
      console.log("This is the error: "+e);
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
