var express = require('express');
var bodyParser = require('body-parser');
var asm = require('ethers');
var provider = new asm.providers.JsonRpcProvider("http://localhost:8545/");

var router = express.Router();

router.get('/', function(req, res) {
    var dataDetail = { 
        version : 1.018
    };

    provider.getBlockNumber().then((blockNumber) => {
        dataDetail.blockid = blockNumber;
        res.send(dataDetail);
    });
});

module.exports = router;