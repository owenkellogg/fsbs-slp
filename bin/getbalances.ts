
// Install BITBOX-SDK v3.0.2+ instance for blockchain access
// For more information visit: https://www.npmjs.com/package/bitbox-sdk
const BITBOXSDK = require('bitbox-sdk');
const slpjs = require('slpjs');

// FOR TESTNET UNCOMMENT
let addr = "simpleledger:qqa4fmhq8ch28dl22fz6gfy8mny7mxqslcxzfykdrf";
const BITBOX = new BITBOXSDK({ restURL: 'https://rest.bitcoin.com/v2/' });

// FOR MAINNET UNCOMMENT
// let addr = "simpleledger:qrhvcy5xlegs858fjqf8ssl6a4f7wpstaqnt0wauwu";
// const BITBOX = new BITBOXSDK({ restURL: 'https://rest.bitcoin.com/v2/' });

const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX);

let balances;

(async function() {
  balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(addr);
  console.log("balances: ", balances);
})();

