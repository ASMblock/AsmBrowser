var express = require('express');
var querystring = require('querystring');
var https = require('https');
var bodyParser = require('body-parser');
var asm = require('ethers');
var Web3 = require('web3');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var provider = new asm.providers.JsonRpcProvider("http://localhost:8545/");

var web3 = new Web3(Web3.givenProvider || "http://localhost:8545/");

var router = express.Router();

router.get('/', urlencodedParser, function(req, res) {

    now_price_data();
    
    var datas = [];
    var dataDetail = { 
        code : 1, 
        msg :  "getIndexData"
    };
    var balArr = {}; 
    var blockNum;   
    var blockidarr = new Array();  
    var blockidarrs = new Array();  
    var blockarr = new Array(); 
    var docountblock = 0; 
    var docountblocks = 0;
    var count_ret_json = {};
    var block_ret = [];
    var blockarr = new Array(); 
    var transactionarr = new Array(); 
    var docounttran = new Array();
    var docountevent = new Array();
    var return1;
    var blockidar;
    var block;
    var count = 1;
    var pay_ret = [];
    var dataJson = {};

    function now_price_data() {
        var data = {
            symbol: "ASM_USDT",
            type: "day",
            size:8
        };
    
        var content = querystring.stringify(data);
    
        var options = {
            hostname: 'www.ztb.com',
            path: '/api/v1/kline?' + content,
            method: 'GET'
        };
    
        var req = https.request(options, function (res1) {
            res1.setEncoding('utf8');
            res1.on('data', function (chunk) {
                datas.push(chunk.slice(2,chunk.length-2));
                var data = datas[0].split('],[');
                var priceData = data[data.length-1];

                dataJson.now_price = getprice(priceData);
                var index = "sort_ret";
                getData(index);

                var dateJson = [];
                for(var i=0; i<8;i++){
                    var da = {};
                    da.date = table_ret(data[i]);
                    da.value = getprice(data[i]);
                    dateJson.push(da);
                }
                dataJson.table_ret = dateJson;

                getBalance();
            });

            function getcountRet(){
                count_ret_json.block_count = blockNum;
                var index = "count_ret";
                getData(index);
                var num_assets = 1800000000 - (balArr.num0+balArr.num1+balArr.num2);
                count_ret_json.num_assets = num_assets;
                count_ret_json.avg_block_time = '5.00 s';
                count_ret_json.unconfirmed_pay = 0;

                count_ret_json.destory_count = parseFloat(balArr.num2);
                var hadmine_count = 900000000 - parseFloat(balArr.num0);
                count_ret_json.hadmine_count = hadmine_count;
                var number1 = parseFloat(balArr.num1);
                count_ret_json.number1 = number1;
                var number2 = parseFloat(balArr.num0);
                count_ret_json.number2 = number2;
                dataJson.count_ret = count_ret_json;
                
                getBlock(blockNum);
            }

            function getBlock(blockN){
                var start = blockN-9;
                for (i = blockN; i >= start; i--) {
                    blockidarrs.push(i);
                }
                getBlockData(blockidarrs[docountblocks]);
            }
            
            function getBlockData(blockidarff) {
                
                provider.getBlock(blockidarff).then((block) => {
                    
                    if (docountblocks<10) {
                        docountblocks++;
                        var blockData = {};
                        blockData.blockid = blockidarff;
                        blockData.blockhash = block.hash;
                        var date = new Date();
                        var timeNow = date.getTime()/1000;
                        var timeStamp = block.timestamp;
                        var time = Math.floor(timeNow-timeStamp);
                        if(time<1){
                            blockData.time = "刚刚";
                        }else {
                            blockData.time = time;
                        }
                        blockData.pay_count = 0;
                        block_ret.push(blockData);
                        getBlockData(blockidarrs[docountblocks]);
                    } else {
                        dataJson.block_ret = block_ret;
                        getPay(blockNum);
                    }
                });
            }    

            function getPay(blockN){
                var start = blockN-50;
                var n = 0;
                for (i = blockN; i >= start; i--) {
                    blockidarr[n]=i;
                    n++;
                }
                docountblock=0;
                mapblockall(blockidarr[docountblock]);
            }

            function sleep(time) {
                return new Promise((resolve) => setTimeout(resolve, time));
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
                if(pay_ret.length==10){
                    dataJson.pay_ret = pay_ret;
                    dataDetail.data = dataJson;
                    res.send(dataDetail);
                }else if(pay_ret.length<10) {
                    getPay(blockidarr[docountblock-1]-1); 
                }
            }

            function compare(property) {
                return function (a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
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
                            if(pay_ret.length<10){
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
                                                            if(pay_ret.length<10 && asm.utils.formatEther(dataraw4)==0.000000000000000001){
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
                                                            if(pay_ret.length<10 && asm.utils.formatEther(dataraw4)!=0.000000000000000001){
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
                                
                                resolve(returnarr);
                            }
                        });
                    });

                })
            }

            function getBalance() {

                var addrArr = ['0x6b3bC25443ad41b1976C57dB0e11B7E65fB4Db07',
                              '0xE310342968cc2A3bdD57D3BD45B91b0A8d0Ca5F4',
                              '0x0000000000000000000000000000000000000000'];

                provider.getBalance(addrArr[0]).then((balance) => {
                    var balance = asm.utils.formatEther(balance);
                    balArr.num0 = parseFloat(balance);
                    provider.getBalance(addrArr[1]).then((balance) => {
                        var balance = asm.utils.formatEther(balance);
                        balArr.num1 = parseFloat(balance);
                        provider.getBalance(addrArr[2]).then((balance) => {
                            var balance = asm.utils.formatEther(balance);
                            balArr.num2 = parseFloat(balance);
                            getBlockNum();
                        });
                    });
                });
            }
            function getBlockNum(){
                provider.getBlockNumber().then((blockNumber) => {
                    blockNum = blockNumber;
                    getcountRet();
                });
            }

            function getData(index) {
                var abi = [
                    {
                     "constant": true,
                     "inputs": [],
                     "name": "get",
                     "outputs": [
                      {
                       "name": "",
                       "type": "string[]"
                      }
                     ],
                     "payable": false,
                     "stateMutability": "view",
                     "type": "function"
                    }
                   ];
                var addr = "0x74Bb1e85c937B2b3D691C23222bc6D1309AA304A";
                var datacontract = new asm.Contract(addr, abi, provider);
        
                var dataArr = new Array();
                datacontract.get().then(function (msg) {
                    if(index == "sort_ret"){
                        var data1 = {
                            "address": msg[0],
                            "num": msg[1]
                        };
                        var data2 = {
                            "address": msg[2],
                            "num": msg[3]
                        };
                        var data3 = {
                            "address": msg[4],
                            "num": msg[5]
                        };
                        dataJson.sort_ret=[data1,data2,data3];
                    }else if(index == "count_ret"){

                        count_ret_json.pay_count = msg[6];
                        count_ret_json.yestoday_power = msg[7];
                        count_ret_json.db_count = msg[8];
                    }
                });
            }
        
            function sort_ret() {
                
            }
            
        });
    
        req.on('error', function (e) {
        });
    
        req.end();
    }

    function regexFun(data){
        var regex = /,"|","|"/;
        var datas = data.split(regex);
        
        return datas;
    }

    function getprice(priceData) {
        
        var data = regexFun(priceData);
        var price = maxFun(data);
        return price;
    }

    function maxFun(data){
        
        var temp = data[1];

        for(var i=2; i<data.length-2; i++) {
            if(temp<data[i]) {
                temp=data[i];
            }
        }
        return temp;
    }

    function table_ret(data) {
        var dateData = regexFun(data);
        var time = dateData[0];
        var date = new Date(+time);
        var dt = (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) ;
        return dt;
    }

});
module.exports = router;