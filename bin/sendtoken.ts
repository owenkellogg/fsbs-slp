#!/usr/bin/env ts-node

require('dotenv').config();

// Install BITBOX-SDK v3.0.2+ instance for blockchain access
// For more information visit: https://www.npmjs.com/package/bitbox-sdk
const bitboxsdk = require('bitbox-sdk');

var BigNumber = require('bignumber.js');
import * as slpjs from 'slpjs';

import * as commander from 'commander';

commander
  .command('send <address>')
  .action(async (address) => {


    var bitbox = new bitboxsdk({ restURL: 'https://rest.bitcoin.com/v2/' });

    var fundingAddress           = "simpleledger:qzmz6s54y4gfdmyczvnk8z5kwv6xtrz4vgksx5u5nc";  // <-- must be simpleledger format
    var fundingWif               = process.env.WIF_FSBS;
    var tokenReceiverAddress     = address;  // <-- must be simpleledger format

    var bchChangeReceiverAddress = fundingAddress;  // <-- cashAddr or slpAddr format
    var batonReceiverAddress     = fundingAddress;

    var bitboxNetwork = new slpjs.BitboxNetwork(bitbox);

    let sendAmounts = [ new BigNumber(1) ];

    const tokenId = '9bd0492a366c55590e86af374fd214f4cca3ff58af5defc40c034720ea203f06';

    // 1) Fetch critical token information
    let tokenDecimals;

    const tokenInfo = await bitboxNetwork.getTokenInformation(tokenId);
    tokenDecimals = tokenInfo.decimals; 
    console.log("Token precision: " + tokenDecimals.toString());

  // Wait for network responses...

  // 2) Check that token balance is greater than our desired sendAmount
    let balances; 
    balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress);
    console.log("'balances' variable is set.");
    console.log("Token balance:", balances.slpTokenBalances[tokenId].toNumber());

    // Wait for network responses...

    // 3) Calculate send amount in "Token Satoshis".  In this example we want to just send 1 token unit to someone...
    sendAmounts = sendAmounts.map(a => (new BigNumber(a)).times(10**tokenDecimals));  // Don't forget to account for token precision

    // 4) Get all of our token's UTXOs
    let inputUtxos = balances.slpTokenUtxos[tokenId];

    // 5) Simply sweep our BCH utxos to fuel the transaction
    inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);

    // 6) Set the proper private key for each Utxo
    inputUtxos.forEach(txo => txo.wif = fundingWif);

    let sendTxid;
    sendTxid = await bitboxNetwork.simpleTokenSend(
        tokenId, 
        sendAmounts, 
        inputUtxos, 
        tokenReceiverAddress, 
        bchChangeReceiverAddress
        )
    console.log("SEND txn complete:", sendTxid);

  });

commander.parse(process.argv);

