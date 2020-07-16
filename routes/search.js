var express = require('express');
var querystring = require('querystring');
var https = require('https');
var asm = require('ethers');
var Web3 = require('web3');
var url = require('url');

var provider = new asm.providers.JsonRpcProvider("http://localhost:8545/");

var web3 = new Web3(Web3.givenProvider || "http://localhost:8545/");

var router = express.Router();

router.get('/', function(req, res) {

    var params = url.parse(req.url, true).query;
    var search = params.search;
    var code;
    var dataDettail = {
        "code": 1,
        "msg": "getBrowserSearch"
    };

    if(search.length==43) {
        search = '0x'+search.substr(3,44);
        try {
            search = asm.utils.getAddress(search);
            provider.getBalance(search).then((balance) => {
                if(balance != null){
                    dataDettail.data = {"type":2};  
                    res.send(dataDettail);
                }
            });
        } catch (error) {
            dataDettail.code = 0;
            dataDettail.msg = "error";
            dataDettail.data = [];  
            res.send(dataDettail);
        }
    }else if(search.length==66){
        try {
            provider.getBlock(search).then((blockff) => {
                if(blockff != null){
                    dataDettail.data = {"type":1};  
                    res.send(dataDettail);
                }else {
                    provider.getTransaction(search).then((transaction) => {
                        if(transaction != null){
                            dataDettail.data = {"type":3};  
                            res.send(dataDettail);
                        }else {
                            dataDettail.code = 0;
                            dataDettail.msg = "error";
                            dataDettail.data = [];  
                            res.send(dataDettail);                
                        }
                    });
                }
            });
        } catch (error) {
            dataDettail.code = 0;
            dataDettail.data = [];  
            res.send(dataDettail); 
        }
    }else if(search.length==74){
        search = search.substr(0,66);
        provider.getTransaction(search).then((transaction) => {
            if(transaction != null){
                dataDettail.data = {"type":3};  
                res.send(dataDettail);
            }else {
                dataDettail.code = 0;
                dataDettail.msg = "error";
                dataDettail.data = [];  
                res.send(dataDettail);            }
        });
    }else if(search.length<66){
        try {
            if(!isNaN(search)){
                if(parseInt(search) == search) {
                    dataDettail.data = {"type":1};  
                    res.send(dataDettail);
                }else {
                    dataDettail.code = 0;
                    dataDettail.msg = "error";
                    dataDettail.data = [];  
                    res.send(dataDettail);                 }
            }else {
                dataDettail.code = 0;
                dataDettail.msg = "error";
                dataDettail.data = [];  
                res.send(dataDettail);            }
        } catch (error) {
            dataDettail.code = 0;
            dataDettail.msg = "error";
            dataDettail.data = [];  
            res.send(dataDettail);         }
    }
});

module.exports = router;