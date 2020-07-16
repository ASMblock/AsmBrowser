var express = require('express');
var asm = require('ethers');
var Web3 = require('web3'); 
var url = require('url');

var provider = new asm.providers.JsonRpcProvider("http://localhost:8545/");

var web3 = new Web3(Web3.givenProvider || "http://localhost:8545/");

var router = express.Router();

router.get('/', function(req, res) {
    var params = url.parse(req.url, true).query;

    var dataDetail = { 
        code : 1, 
        msg :  "getBalanceDetail"
    };

    var address = params.address;
    var data = {};
    data.address = address;
    address = "0x"+address.substr(3,43);
    provider.getBalance(address).then((balance) => {
        
        let etherString = asm.utils.formatEther(balance);
        if(balance != null){
            data.balance = etherString;
            data.usd = 0;

            addr = '0xcc16ee675b2b8d93c3fe324206270b9a6b0734ff';
            abi = [{
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }];
            var datacontract = new asm.Contract(addr, abi, provider);
            datacontract.balanceOf(address).then(function (balanceNum) {
                let balanceStr = asm.utils.formatEther(balanceNum)*(10**18);
                data.coin_value = balanceStr;
                data.coin_category = "asmlock";
                data.rate = 100;
                dataDetail.data = data;
                dataDetail.payList = [];
                res.send(dataDetail);
            });
        }
    });
});    

module.exports = router;