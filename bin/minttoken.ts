require('dotenv').config();

// Install BITBOX-SDK v3.0.2+ instance for blockchain access
// For more information visit: https://www.npmjs.com/package/bitbox-sdk
const bitboxsdk = require('bitbox-sdk');

var BigNumber = require('bignumber.js');
import * as slpjs from 'slpjs';

var bitbox = new bitboxsdk({ restURL: 'https://rest.bitcoin.com/v2/' });
var fundingAddress           = "simpleledger:qqa4fmhq8ch28dl22fz6gfy8mny7mxqslcxzfykdrf";  // <-- must be simpleledger format
var fundingWif               = process.env.WIF;
var tokenReceiverAddress     = "simpleledger:qqa4fmhq8ch28dl22fz6gfy8mny7mxqslcxzfykdrf";  // <-- must be simpleledger format
var bchChangeReceiverAddress = "simpleledger:qqa4fmhq8ch28dl22fz6gfy8mny7mxqslcxzfykdrf";  // <-- cashAddr or slpAddr format
var batonReceiverAddress     = "simpleledger:qqa4fmhq8ch28dl22fz6gfy8mny7mxqslcxzfykdrf";

var bitboxNetwork = new slpjs.BitboxNetwork(bitbox);

var balances;

// 1) Get all balances at the funding address.
(async function() {

  balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress);
  console.log("'balances' variable is set.");
  console.log('BCH balance:', balances.satoshis_available_bch);

  // WAIT FOR NETWORK RESPONSE...

  // 2) Select decimal precision for this new token
  let decimals = 0;
  let name = "Free State Bitcoin Shoppe Checkin";
  let ticker = "FSBSC";
  let documentUri = "checkin@freestatebitcoin.com";
  let documentHash = null;
  let initialTokenQty = new BigNumber(1000000);

  console.log('balances', balances);

  // 4) Set private keys
  balances.nonSlpUtxos.forEach(txo => txo.wif = fundingWif)

// 5) Use "simpleTokenGenesis()" helper method
  let genesisTxid;
  genesisTxid = await bitboxNetwork.simpleTokenGenesis(
      name,
      ticker,
      initialTokenQty,
      documentUri,
      documentHash,
      decimals,
      tokenReceiverAddress,
      batonReceiverAddress,
      bchChangeReceiverAddress,
      balances.nonSlpUtxos
      )
  console.log("GENESIS txn complete:", genesisTxid)
})();

