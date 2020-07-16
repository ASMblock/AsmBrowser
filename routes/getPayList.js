var express = require('express');
var asm = require('ethers');
var Web3 = require('web3'); 

var provider = new asm.providers.JsonRpcProvider("http://localhost:8545/");

var web3 = new Web3(Web3.givenProvider || "http://localhost:8545/");

var router = express.Router();

router.get('/', function(req,res) {

    var dataDetail = { 
        code : 1, 
        msg :  "getPayList"
    };

    var data = {};
    var countNum = 100;
    var blockidarr = new Array();  
    var blockarr = new Array(); 
    var docountblock = 0; 
    var blockarr = new Array();
    var transactionarr = new Array(); 
    var docounttran = new Array();
    var docountevent = new Array();
    var return1;
    var blockidar;
    var block;
    var count = 1;
    var pay_ret = [];

    provider.getBlockNumber().then((blockNumber) => {
        getPay(blockNumber);
        function getPay(blockNum){
            var start = blockNum-50;
            var n = 0;
            for (i = blockNum; i >= start; i--) {
                blockidarr[n]=i;
                n++;
            }
            docountblock=0;
            mapblockall(blockidarr[docountblock]);
        }
    
        function mapblockall(blockidarff) {
            blockidar = blockidarff;
            
            provider.getBlock(blockidar).then((blockff) => {
               
                block = blockff;
                var blockde = { "blockhash": block.hash, "blockid": block.number, "timestamp": block.timestamp }
                blockarr.push(blockde);
                if (block.transactions.length) {
    
                    docounttran[blockidar] = 0;
                    docountevent[blockidar] = new Array();
                    maptrans(block.transactions[docounttran[blockidar]], 0, block.timestamp);
                } else {
                    docountblock++;
                    if (docountblock == blockidarr.length) {
                        returnaaa();
                    } else {
                        mapblockall(blockidarr[docountblock]);
                    }
                }
    
            });
    
        }
    
        function maptrans(tranhash, index1, timeS) {
    
                try {
                    transactiondata(tranhash, index1,timeS).then((tranarr) => {
                        tranarr.map(function (tranarrde) {
                            transactionarr.push(tranarrde);
                        })
                        docounttran[blockidar]++;
                        if (docounttran[blockidar] == block.transactions.length) {
                            docountblock++;
    
                            if (docountblock == blockidarr.length) {
                                returnaaa();
                            } else {
                                mapblockall(blockidarr[docountblock]);
                            }
                        } else {
                            maptrans(block.transactions[docounttran[blockidar]], 0, timeS);
                        }
                    })
                } catch (e) {
                    docounttran[blockidar]++;
                    if (docounttran[blockidar] == block.transactions.length) {
                        docountblock++;
    
                        if (docountblock == blockidarr.length) {
                            returnaaa();
                        } else {
                            mapblockall(blockidarr[docountblock]);
                        }
                    } else {
                        maptrans(block.transactions[docounttran[blockidar]], 0, timeS);
                    }
                }
        }
    
        function returnaaa() {
            return1 = { 'transaction': transactionarr.sort(compare("blockid")), 'block': blockarr.sort(compare("blockid")) };
            ret = { 'status': 1, 'return': return1 };
            if(pay_ret.length==100){
                data.count = countNum;
                data.list = pay_ret;
                dataDetail.data = data;
                res.send(dataDetail);
            }else if(pay_ret.length<100) {
                getPay(blockidarr[docountblock-1]-1); 
            }
        }
    
        function filter(str) {
             return str.replace(/[^a-z0-9. ]/ig, " ");
        }

        function transactiondata(hash, index1,timeS) {
            let transactionHash = hash;
            return new Promise((resolve, reject) => {
                provider.getTransaction(transactionHash).then((transaction) => {
                    let from = transaction.from;
                    let gasprice = transaction.gasPrice;
                    let value = asm.utils.formatEther(transaction.value);
                    let blockNumber = transaction.blockNumber;
                    let datahex = transaction.data;
                    
                    var date = new Date(timeS * 1000);
                    var time = (date.getHours() < 10 ? '0' + (date.getHours()+1) : (date.getHours())) + ':' + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : (date.getMinutes()))+ ':'+ (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : (date.getSeconds()));
                    
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
                        let status = receipt.status;
                        
                        var date = new Date();
                        var time_now = date.getTime()/1000;
                        var last_time = Math.floor((time_now - timeS)/60);
    
                        var return0 = new Array();
                        var returnarr = new Array();
                        var pay_arr = new Array();
                        return0 = { 'transferto': 'ASM'.concat(to.substring(2, 42)), 'sender': 'ASM'.concat(from.substring(2, 42)), 'value': value, 'fee': fee, 'blockid': blockNumber, 'hash': transactionHash, 'data': datastring, };
                        pay_arr = { 'id': count, 'coin_num': value, 'time': time, 'last_time': last_time, 'pay_id': transactionHash, 'to_address': 'ASM'.concat(to.substring(2, 42)), 'get_address': 'ASM'.concat(from.substring(2, 42))};
                        count++;
                        returnarr.push(return0);
                        if(pay_ret.length<100){
                            pay_ret.push(pay_arr);
                        }
                        if (value == 0 || value == 9.9) {
                            web3.eth.getCode(to).then(
                                function (result) {
                                    if (result == '0x') {
                                        resolve(returnarr);
                                    } else {
                                        docountevent[blockidar][index1] = 0;
                                        var abiredpacket = [];
                                        var myContract = new web3.eth.Contract(abiredpacket, to, {});
                                        myContract.getPastEvents('allEvents', {
                                            filter: {}, 
                                            fromBlock: blockNumber,
                                            toBlock: blockNumber
                                        }).then(function (events) {
                                            
                                            if (events.length==0) {
                                                resolve(returnarr)
                                            }
    
                                            events.map(function (item) {
                                                if (item.transactionHash == transactionHash) {
                                                    if (item.raw.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
                                                        
                                                        var dataraw = new Array();
                                                        var hash = item.transactionHash + item.id.substring(4, 12);
                                                        var dataraw4 = web3.utils.hexToNumberString('0x'.concat(item.raw.data.substring(26, 66)));
                                                        return0 = {
                                                            'transferto': 'ASM'.concat(item.raw.topics[2].substring(26, 66)),
                                                            'sender': 'ASM'.concat(item.raw.topics[1].substring(26, 66)), "value": asm.utils.formatEther(dataraw4), 'fee': fee,
                                                            'blockid': blockNumber, 'hash': hash, 'data': datastring,"topics": item.raw.topics[0], "token": item.address, "tokenvalue": dataraw4
                                                        };
                                                        pay_arr = { 'id': count, 'coin_num': asm.utils.formatEther(dataraw4), 'time': time, 'last_time': last_time, 'pay_id': hash, 'to_address': 'ASM'.concat(item.raw.topics[2].substring(26, 66)), 'get_address': 'ASM'.concat(item.raw.topics[1].substring(26, 66))};
                                                        count++;
                                                        if(pay_ret.length<100 && asm.utils.formatEther(dataraw4)==0.000000000000000001){
                                                            pay_ret.push(pay_arr);
                                                        }
                                                        returnarr.push(return0);
                                                        docountevent[blockidar][index1]++;
                                                        if (docountevent[blockidar][index1] == events.length) {
                                                            resolve(returnarr)
                                                        }
                                                        
                                                    } else if (item.raw.topics[0] == "0xd1398bee19313d6bf672ccb116e51f4a1a947e91c757907f51fbb5b5e56c698f" || item.raw.topics[0] == "0xae33cb06d7303f889d953bb09540983050163c1c4c98b330db432a911cfb63fd") {
                                                        var dataraw = new Array();
                                                        var dataraw1 = '0x'.concat(item.raw.data.substring(26, 66));
                                                        var dataraw2 = '0x'.concat(item.raw.data.substring(64 + 26, 64 + 66));
                                                        var dataraw3 = '0x'.concat(item.raw.data.substring(64 + 64 + 26, 64 + 64 + 66));
                                                        var dataraw4 = web3.utils.hexToNumberString('0x'.concat(item.raw.data.substring(64 + 64 + 64 + 26, 64 + 64 + 64 + 66)));
                                                        var hash = item.transactionHash + item.id.substring(4, 12);
                                                        
                                                        return0 = {
                                                            'transferto': 'ASM'.concat(dataraw3.substring(2, 42)),
                                                            'sender': 'ASM'.concat(dataraw2.substring(2, 42)), "value": asm.utils.formatEther(dataraw4), 'fee': fee,
                                                            'blockid': blockNumber, 'hash': hash, 'data': datastring, "topics": item.raw.topics[0], "token": dataraw1, "tokenvalue": dataraw4
                                                        };
                                                        pay_arr = { 'id': count, 'coin_num': asm.utils.formatEther(dataraw4), 'time': time, 'last_time': last_time, 'pay_id': hash, 'to_address': 'ASM'.concat(dataraw3.substring(2, 42)), 'get_address': 'ASM'.concat(dataraw2.substring(2, 42))};
                                                        count++;
                                                        if(pay_ret.length<100 && asm.utils.formatEther(dataraw4)!=0.000000000000000001){
                                                            pay_ret.push(pay_arr);
                                                        }
                                                        returnarr.push(return0);
                                                        docountevent[blockidar][index1]++;
                                                        if (docountevent[blockidar][index1] == events.length) {
                                                            resolve(returnarr)
                                                        }
                                                        
                                                    } else {
                                                        docountevent[blockidar][index1]++;
                                                        if (docountevent[blockidar][index1] == events.length) {
                                                            resolve(returnarr)
                                                        }
                                                    }
                                                } else {
                                                    docountevent[blockidar][index1]++;
                                                    if (docountevent[blockidar][index1] == events.length) {
                                                        resolve(returnarr)
                                                    }
                                                }
                                            })
                                        });
                                    };
                                });
                        } else {
                            resolve(returnarr)
                            
                        }
                    });
                });
    
            })
        }
    
        function compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        }
    });


});

module.exports = router;