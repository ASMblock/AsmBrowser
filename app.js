var express = require('express');
var server = require('./server');

var app = express();


app.all("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","content-type");
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);
    else
        next();
})

var getVersionRouter = require('./routes/getVersion');
var getPayListRouter = require('./routes/getPayList');
var getBlockListRouter = require('./routes/getBlockList');
var getPayDetailRouter = require('./routes/getPayDetail');
var getBlockDetailRouter = require('./routes/getBlockDetail');
var getIndexDataRouter = require('./routes/getIndexData');
var searchRouter = require('./routes/search');
var getBalanceDetailRouter = require('./routes/getBalanceDetail');

app.use('/getVersion', getVersionRouter);
app.use('/getPayList', getPayListRouter);
app.use('/getBlockList', getBlockListRouter);
app.use('/getPayDetail', getPayDetailRouter);
app.use('/getBlockDetail', getBlockDetailRouter);
app.use('/getIndexData', getIndexDataRouter);
app.use('/getBrowserSearch', searchRouter);
app.use('/getBalanceDetail', getBalanceDetailRouter);

server.startServer();
app.listen(3000);
