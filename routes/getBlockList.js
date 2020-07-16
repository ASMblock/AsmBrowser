var express = require('express');
var asm = require('ethers');
var url = require('url');

var provider = new asm.providers.JsonRpcProvider("http://localhost:8545/");

var router = express.Router();

router.get('/', function(req, res) {
    var params = url.parse(req.url, true).query;

    var page = params.page;
    var limit = parseInt(params.limit);
    if(page == null || page==0){
        page = 1;
    }

    var dataDetail = { 
        code : 1, 
        msg :  "getBlockList"
    };

    var list = [];
    var data = {};
    var count = 0;

    provider.getBlockNumber().then((blockNumber) => {
        count = blockNumber;
        data.count = blockNumber;

        var blockNum = count - 10*parseInt(params.page-1);
        getBlockData(blockNum);
        
        function getBlockData(blockNumber) {
            provider.getBlock(blockNumber).then((blockff) => {
            
                block = blockff;
                var listData = {};
                
                var time = block.timestamp;
                var date = new Date( time * 1000 );
                var createtime = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' +
                (date.getHours() < 10 ? '0' + (date.getHours()) : (date.getHours())) + ':' + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : (date.getMinutes()))+ ':'+ (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : (date.getSeconds()));
                
                listData.block_id = block.number;
                listData.blockhash = block.hash;
                listData.createtime = createtime;
                listData.pay_count = block.transactions.length;

                list.push(listData);
                if(list.length<limit) {
                    getBlockData(--blockNum);
                }else {
                    data.list = list;
                    dataDetail.data = data;
                    res.send(dataDetail);
                }
            });
        }
    });
});

module.exports = router;