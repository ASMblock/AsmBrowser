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
        msg :  "getBlockDetail"
    };
    var data = {};
    var block_info = {};
    var transactionarr = new Array();
    var docountevent = new Array();
    var returnarr = new Array();
    var block;
    var blockid;
    var feeCount = 0;

    var blockData = params.id;
    getBlockDetail(blockData);
    function getBlockDetail(blockData) {
        
        let n = blockData;
        if(n.length!=66) {
            n = '0x' + Number(n).toString(16);
        } else {
            n = blockData;
        }
        provider.getBlock(n).then((blockff) => {
            block = blockff;

            block_info.hash = block.hash;
            block_info.up_block_id = block.number - 1;
            block_info.down_block_id = block.number + 1;
            block_info.block_id = block.number;
            block_info.block_hash = block.hash;
            block_info.version = "v2.07",
            block_info.hash_tree_bottom = block.hash;
            var time = block.timestamp;
            var date = new Date( time * 1000 );
            block_info.createtime = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' +
            (date.getHours() < 10 ? '0' + (date.getHours()+1) : (date.getHours())) + ':' + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : (date.getMinutes()))+ ':'+ (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : (date.getSeconds()));
            block_info.rand_num = 668808;

            if (block.transactions.length) {

                blockid = 0;
                docountevent[blockData] = new Array();

                maptrans(block.transactions[blockid], 0);
            }else {
                getNull();
            }
        });

    }

    function getNull(){
        block_info.pay_count = 0;
        block_info.fee = 0;
        data.block_info = block_info;
        data.pay_list = returnarr;

        dataDetail.data = data;

        returnarr = [];

        returnaaa();
    }

    function maptrans(tranhash, index1) {
        try {
            transactiondata(tranhash, index1).then((tranarr) => {
                
                tranarr.map(function (tranarrde) {
                    transactionarr.push(tranarrde);
                })
                blockid++;
                if (blockid == block.transactions.length) {
                    block_info.pay_count = returnarr.length;
                    block_info.fee = feeCount;
                    data.block_info = block_info;
                    data.pay_list = returnarr;

                    dataDetail.data = data;
                    returnaaa();
                }else {
                    maptrans(block.transactions[blockid], 0);
                }
            })
        } catch (e) {
            blockid++;
            if (blockid == block.transactions.length) {
                returnaaa();
            }else {
                maptrans(block.transactions[blockid], 0);
            }
        }
    }

    function returnaaa() {
        res.send(dataDetail);
    }

    function transactiondata(hash, index1) {
        let transactionHash = hash;
        return new Promise((resolve, reject) => {
            provider.getTransaction(transactionHash).then((transaction) => {
                let from = transaction.from;
                let gasprice = transaction.gasPrice;
                let value = asm.utils.formatEther(transaction.value);
                let blockNumber = transaction.blockNumber;
                let datastr = transaction.data;

                provider.getTransactionReceipt(transactionHash).then((receipt) => {
                    if (receipt.to == null) {
                        var to = receipt.contractAddress;
                    } else {
                        var to = receipt.to;
                    }
                    let gasused = receipt.gasUsed;
                    let fee = asm.utils.formatEther(gasused.mul(gasprice));
                    feeCount += parseFloat(fee);
                    var return0 = {};
                    return0 = {
                        'id': transactionHash,
                        'value': value,
                        'go_address': 'ASM'.concat(from.substring(2, 42)),
                        'go_value': '-'+value+'ASM',
                        'to_address': 'ASM'.concat(to.substring(2, 42)),
                        'to_value': '+'+value+'ASM',
                        'fee': fee
                    };
                    returnarr.push(return0);

                    if (value == 0 || value == 9.9) {
                        web3.eth.getCode(to).then(
                            function (result) {
                                if (result == '0x') {
                                    resolve(returnarr);
                                } else {
                                    docountevent[blockData][index1] = 0;
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
                                                        value = dataraw4/(10**12);
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
                                                        'id': hash,
                                                        'value': value,
                                                        'go_address': 'ASM'.concat(item.raw.topics[1].substring(26, 66)),
                                                        'go_value': '-'+value+token, 
                                                        'to_address': 'ASM'.concat(item.raw.topics[2].substring(26, 66)),
                                                        'to_value': '+'+value+token,
                                                        'fee': fee
                                                    };
                                                    if(asm.utils.formatEther(dataraw4)!=0.000000000000000001){
                                                        feeCount += parseFloat(fee);
                                                        returnarr.push(return0);
                                                    }
                                                    docountevent[blockidar][index1]++;
                                                    if (docountevent[blockidar][index1] == events.length) {
                                                        resolve(returnarr)
                                                    }
                                                    
                                                } else if (item.raw.topics[0] == "0xd1398bee19313d6bf672ccb116e51f4a1a947e91c757907f51fbb5b5e56c698f" || item.raw.topics[0] == "0xae33cb06d7303f889d953bb09540983050163c1c4c98b330db432a911cfb63fd") {
                                                    
                                                    var dataraw1 = '0x'.concat(item.raw.data.substring(26, 66));
                                                    var dataraw2 = '0x'.concat(item.raw.data.substring(64 + 26, 64 + 66));
                                                    var dataraw3 = '0x'.concat(item.raw.data.substring(64 + 64 + 26, 64 + 64 + 66));
                                                    var dataraw4 = web3.utils.hexToNumberString('0x'.concat(item.raw.data.substring(64 + 64 + 64 + 26, 64 + 64 + 64 + 66)));
                                                    var hash = item.transactionHash + item.id.substring(4, 12);
                                                    
                                                    return0 = {
                                                        'id': hash,
                                                        'value': asm.utils.formatEther(dataraw4),
                                                        'go_address': 'ASM'.concat(dataraw2.substring(2, 42)),
                                                        'go_value': '-'+asm.utils.formatEther(dataraw4)+'ASM',
                                                        'to_address': 'ASM'.concat(dataraw3.substring(2, 42)),
                                                        'to_value': '+'+asm.utils.formatEther(dataraw4)+'ASM',
                                                        'fee': fee
                                                    };
                                                    if(asm.utils.formatEther(dataraw4)!=0.000000000000000001){
                                                        feeCount += parseFloat(fee);
                                                        returnarr.push(return0);
                                                    }
                                                    docountevent[blockData][index1]++;
                                                    if (docountevent[blockData][index1] == events.length) {
                                                        resolve(returnarr)
                                                    }
                                                } else {
                                                    docountevent[blockData][index1]++;
                                                    if (docountevent[blockData][index1] == events.length) {
                                                        resolve(returnarr)
                                                    }
                                                }
                                            } else {
                                                docountevent[blockData][index1]++;
                                                if (docountevent[blockData][index1] == events.length) {
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
});

module.exports = router;