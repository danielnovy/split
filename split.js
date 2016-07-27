var Web3 = require('web3');
var Promise = require('bluebird');
var HookedWeb3Provider = require('hooked-web3-provider');
var Transaction = require('ethereumjs-tx');
var web3 = new Web3();

var HOST = 'https://mainnet.infura.io';

var ETH_ADDRESS = '0x';
var ETC_ADDRESS = '0x';

var ADDRESS_SOURCE = '0x';
var PRIVATE_KEY = '';

var VALUE_TO_SPLIT = <amount in ethers> * Math.pow(10, 18);

var abi = JSON.parse('[{"constant":false,"inputs":[{"name":"targetFork","type":"address"},{"name":"targetNoFork","type":"address"}],"name":"split","outputs":[{"name":"","type":"bool"}],"type":"function"}]');
var address = '0xaa1a6e3e6ef20068f7f8d8c835d2d22fd5116444';

var provider = new HookedWeb3Provider({
    host: HOST,
    transaction_signer: {
        hasAddress: function(address, callback) {
            callback(null, true);
        },
        signTransaction: function(tx_params, callback) {
            tx_params.gasLimit = tx_params.gas;
            tx_params.gasPrice = '0x' + web3.eth.gasPrice.toString(16);
            var tx = new Transaction(tx_params);
            tx.sign(new Buffer(PRIVATE_KEY, 'hex'));
            var signed = tx.serialize().toString('hex');
            callback(null, signed);
        }
    }
});
web3.setProvider(provider);

var contract = web3.eth.contract(abi).at(address);

Promise.promisify(contract.split)(ETH_ADDRESS, ETC_ADDRESS, {from:ADDRESS_SOURCE, gas:100000, value: VALUE_TO_SPLIT})
.then(function(hash) {
    console.log('txHash: ' + hash);
});
