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
        msg :  "getPayDetail"
    };

    var data = {};
    var transData = '';
    var logid = '';
    var len = params.id.length;
    if(len == 74) {
        transData = params.id.substr(0,66);
        logid = params.id.substr(66,8);
    }else {
        transData = params.id;
    }
    getTransactionData(transData,logid);

    function getNull(){
        dataDetail.data = {};
        returnaaa();
    }

    function returnaaa() {
        res.send(dataDetail);
    }

    function filter(str) {
        return str.replace(/[^a-z0-9. ]/ig, " ");
    }

    function getTransactionData(hash,logid) {
        let transactionHash = hash;
        if(logid == ''){
            return new Promise((resolve, reject) => {
                provider.getTransaction(transactionHash).then((transaction) => {
                    if(transaction == ''){
                        getNull();
                    }else {
                        let from = transaction.from;
                        let gasprice = transaction.gasPrice;
                        let value = asm.utils.formatEther(transaction.value);
                        let blockNumber = transaction.blockNumber;
                        let datahex = transaction.data;
                        try {
                            var datastring = web3.utils.hexToUtf8(datahex);
                        } catch (e) {
                            var datastring = datahex;
                        }
                        if (datastring.length < 100) {
                            datastring = filter(datastring);
                        } else {
                            datastring = "too long";
                        }
    
                        provider.getTransactionReceipt(transactionHash).then((receipt) => {
                            if (receipt.to == null) {
                                var to = receipt.contractAddress;
                            } else {
                                var to = receipt.to;
                            }
                            let gasused = receipt.gasUsed;
                            let fee = asm.utils.formatEther(gasused.mul(gasprice));
                            
                            var info = {};
                            info.hash = transactionHash;
                            info.block_id = blockNumber;
                            info.value = value;
                            info.size = datastring;
                            info.fee = fee;
    
                            var log = {
                                'value': value,
                                'id': transactionHash,
                                'to_address': 'ASM'.concat(to.substring(2, 42)),
                                'to_value': '+'+value+'ASM',
                                'get_address': 'ASM'.concat(from.substring(2, 42)),
                                'get_value': '-'+value+'ASM',
                                'fee': fee
                            };
                            data.info = info;
                            data.log = log;
                            dataDetail.data = data;
                            returnaaa();
                        });
                    }
                });
            })
        }else {
            return new Promise((resolve, reject) => {
                provider.getTransaction(transactionHash).then((transaction) => {
                    if(transaction==''){
                        getNull();
                    } else {
                        let gasprice = transaction.gasPrice;
                        let value = asm.utils.formatEther(transaction.value);
                        let blockNumber = transaction.blockNumber;
                        
                        provider.getTransactionReceipt(transactionHash).then((receipt) => {
                            if (receipt.to == null) {
                                var to = receipt.contractAddress;
                            } else {
                                var to = receipt.to;
                            }
                            
                            let gasused = receipt.gasUsed;
                            let fee = asm.utils.formatEther(gasused.mul(gasprice));

                            if (value == 0 || value == 9.9) {
                                web3.eth.getCode(to).then(
                                    function (result) {
                                        if (result == '0x') {
                                            resolve(dataDetail);
                                        } else {                                       
                                            var abiredpacket = [];
                                            var myContract = new web3.eth.Contract(abiredpacket, to, {});
                                            myContract.getPastEvents('allEvents', {
                                                filter: {}, 
                                                fromBlock: blockNumber,
                                                toBlock: blockNumber
                                            }).then(function (events) {
                                                
                                                if (events.length==0) {
                                                    
                                                    resolve(dataDetail)
                                                }
        
                                                events.map(function (item) {
                                                    
                                                    if(logid == item.id.substring(4, 12)){
                                                        if (item.transactionHash == transactionHash) {
                                                           
                                                            var addr = item.address.toLowerCase();
                                                            if (item.raw.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
                                                               
                                                                var value;
                                                                var token;
                                                                if(addr == '0x0000000000000000000000000000000000000000'){
                                                                    value = dataraw4/(10**12);
                                                                    token = 'ASM';
                                                                }else if(addr == '0x124759d3720afb7ac8e57beafebf72fc56c86004'){
                                                                    value = dataraw4/(10**0);
                                                                    token = 'ISM';
                                                                }else if(addr == '0xcc16ee675b2b8d93c3fe324206270b9a6b0734ff'){
                                                                    value = dataraw4/(10**0);
                                                                    token = 'ASMLOCK';
                                                                }else if(addr == '0x0f5c04b4ff64c2fc33f489942b58cb063a87f761'){
                                                                    value = dataraw4/(10**12);
                                                                    token = 'BTC';
                                                                }else if(addr == '0x215182f6aecc931e1f9d6270d0a02be32323e6ae'){
                                                                    value = dataraw4/(10**12);
                                                                    token = 'ETH';
                                                                }else if(addr == '0xab21a4b2a4f3c799853ef471a0fb45fe0cf6aae6'){
                                                                    value = dataraw4/(10**12);
                                                                    token = 'USDT';
                                                                }else if(addr == '0xa2d1f871dfcc7dd7d99cbc2a9db335f3f6a83983'){
                                                                    value = dataraw4/(10**12);
                                                                    token = 'ASN';
                                                                }else if(addr == '0x65cbfdddeffc80205e0e8a8991cbb360fbea1d8b'){
                                                                    value = dataraw4/(10**12);
                                                                    token = 'SRM';
                                                                }else if(addr == '0xdfc8a9b556030797d40e740a9d3e51863027a598'){
                                                                    value = dataraw4/(10**12);
                                                                    token = 'AMTR';
                                                                }else {
                                                                    value = 0;
                                                                    token = 'UNKNOWN';
                                                                }
            
                                                                var hash = item.transactionHash + item.id.substring(4, 12);
                                                                var dataraw4 = web3.utils.hexToNumberString('0x'.concat(item.raw.data.substring(26, 66)));
                                                                
                                                                return0 = {
                                                                    'value': value,
                                                                    'id': hash,
                                                                    'to_address': 'ASM'.concat(item.raw.topics[1].substring(26, 66)),
                                                                    'to_value': '-'+value+token,
                                                                    'get_address': 'ASM'.concat(item.raw.topics[2].substring(26, 66)),
                                                                    'get_value': '+'+value+token, 
                                                                    'fee': fee
                                                                };

                                                                var info = {};
                                                                info.hash = hash;
                                                                info.block_id = blockNumber;
                                                                info.value = value;
                                                                info.size = "0";
                                                                info.fee = fee;
                                                                
                                                                if(asm.utils.formatEther(dataraw4)!=0.000000000000000001){
                                                                    data.info = info;
                                                                    data.log = return0;
                                                                    dataDetail.data = data;
                                                                }
                                                                
                                                            } else if (item.raw.topics[0] == "0xd1398bee19313d6bf672ccb116e51f4a1a947e91c757907f51fbb5b5e56c698f" || item.raw.topics[0] == "0xae33cb06d7303f889d953bb09540983050163c1c4c98b330db432a911cfb63fd") {
                                                                
                                                                var dataraw1 = '0x'.concat(item.raw.data.substring(26, 66));
                                                                var dataraw2 = '0x'.concat(item.raw.data.substring(64 + 26, 64 + 66));
                                                                var dataraw3 = '0x'.concat(item.raw.data.substring(64 + 64 + 26, 64 + 64 + 66));
                                                                var dataraw4 = web3.utils.hexToNumberString('0x'.concat(item.raw.data.substring(64 + 64 + 64 + 26, 64 + 64 + 64 + 66)));
                                                                var hash = item.transactionHash + item.id.substring(4, 12);
                                                                
                                                                return0 = {
                                                                    'value': asm.utils.formatEther(dataraw4),
                                                                    'id': hash,
                                                                    'to_address': 'ASM'.concat(dataraw2.substring(2, 42)),
                                                                    'to_value': '-'+asm.utils.formatEther(dataraw4)+'ASM',
                                                                    'get_address': 'ASM'.concat(dataraw3.substring(2, 42)),
                                                                    'get_value': '+'+asm.utils.formatEther(dataraw4)+'ASM',
                                                                    'fee': fee
                                                                };

                                                                var info = {};
                                                                info.hash = hash;
                                                                info.block_id = blockNumber;
                                                                info.value = asm.utils.formatEther(dataraw4);
                                                                info.size = "0";
                                                                info.fee = fee;

                                                                if(asm.utils.formatEther(dataraw4)!=0.000000000000000001){
                                                                    data.info = info;
                                                                    data.log = return0;
                                                                    dataDetail.data = data;
                                                                }
                                                                
                                                            } else {
                                                                resolve(dataDetail);
                                                            }
                                                            returnaaa();
                                                        }
                                                    }
                                                })
                                            });
                                        };
                                    });
                            } else {
                                
                                resolve(dataDetail)
                            }
                        });
                    }
                });
            })
        }
    }
});

module.exports = router;