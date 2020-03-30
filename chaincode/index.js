'use strict';

const pharmanet = require('./pharmanet.js');
const manufacturer = require('./manufacturer.js');
const transfer = require('./transfer.js');

module.exports.manufacturer = manufacturer;
module.exports.transfer = transfer;
module.exports.pharmanet = pharmanet;
module.exports.contracts = [pharmanet,manufacturer,transfer];
