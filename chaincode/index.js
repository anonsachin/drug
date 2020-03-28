'use strict';

const pharmanet = require('./pharmanet.js');
const manufacturer = require('./manufacturer.js');

module.exports.manufacturer = manufacturer;
module.exports.pharmanet = pharmanet;
module.exports.contracts = [pharmanet,manufacturer];
