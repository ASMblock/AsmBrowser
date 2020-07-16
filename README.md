#### 需要准备的服务器
2核（CPU）4G（内存）50G（硬盘）2M（带宽）1 IP（独立IP）以上，（最低要求，低于此无法正常运行，可以比此高）
地区不限（若为快速连接，可选择香港、新加坡、日本等地）
www.aliyun.com 阿里云
www.vultr.com  新加坡/日本
www.yisu.com  香港
如果是阿里云 腾讯云 需在防火墙（安全组）设置中给0.0.0.0/0放开8545,30303,22,80,3000这几个端口
推荐选择centos7.6操作系统

#### 远程连接到服务器
使用xshell等远程连接工具，连接到服务器

#### 部署全量节点
请拷贝下面的代码在xshell粘贴后回车即可

```
cd ~
wget https://download.asmblock.io/asmnodev203.tar.gz
tar -xzf asmnodev203.tar.gz
cd ~/asmnodev203
./geth init asmblock.json 
wget https://download.asmblock.io/static-nodes.json
mv -f static-nodes.json ~/.ethereum
nohup ./geth --networkid=668808 --nodiscover --rpc --rpcaddr=0.0.0.0 --maxpeers 1000 --allow-insecure-unlock &
cd ~
wget https://download.asmblock.io/node-v12.10.0-linux-x64.tar.xz
tar -xvf node-v12.10.0-linux-x64.tar.xz 
ln -s ~/node-v12.10.0-linux-x64/bin/node /usr/local/bin/node
ln -s ~/node-v12.10.0-linux-x64/bin/npm /usr/local/bin/npm
npm install -g pm2
ln -s ~/node-v12.10.0-linux-x64/bin/pm2 /usr/local/bin/pm2
pm2 -v
cd ~
wget https://download.asmblock.io/AsmBrowser.tar.gz
tar -xzf AsmBrowser.tar.gz 
cd AsmBrowser
pm2 start app.js

```


完成后可以查看同步进度(任何时候可以查看)

```
回车
cd ~/asmnodev203
./geth attach
回车
eth.syncing
这个是首次同步时查看同步进度

eth.blockNumber
这个是查看当前区块ID

当区块数与实际（区块浏览器http://browser.asmblock.io）相符时即同步完成
```
完成后可以查看区块浏览器是否部署完成(任何时候可以查看)
```
打开区块浏览器查看是否显示正常 网址是：服务器ip地址，如
http://8.210.211.106

打开区块浏览器版本检查地址查看版本是否正常，网址为，服务器ip:3000/getVersion
http://8.210.211.106:3000/getVersion

上述网页显示正常即部署完成

```



#### 全节点权益激活
在ASM DAPP 
1、生态->全量节点->自主锁仓 锁仓10000ASM
2、生态->全量节点->全节点权益激活 输入部署全节点的服务器IP地址 点击激活
3、5分钟可以在 生态->全量节点->全节点详情 查看激活情况和收益

注：若出现全节点掉线等原因，导致全节点没有显示在全节点清单中，可以重新激活（参考第2步）。


#### 全节点重启（每次服务器重启时）
```
ps -ef | grep geth | awk '{print $2}' | xargs kill -9
cd ~/asmnodev203
wget https://download.asmblock.io/static-nodes.json
mv -f static-nodes.json ~/.ethereum
nohup ./geth --networkid=668808 --nodiscover --rpc --rpcaddr=0.0.0.0 --maxpeers 1000 --allow-insecure-unlock &
cd ~/AsmBrowser
pm2 start app.js
```

#### 全节点修复（强制清零，非专业指导请勿使用！）
```
ps -ef | grep "geth" | awk '{print $2}' | xargs kill -9
rm -rf ~/.ethereum
cd ~/asmnodev203
./geth init asmblock.json 
wget https://download.asmblock.io/static-nodes.json
mv -f static-nodes.json ~/.ethereum
nohup ./geth --networkid=668808 --nodiscover --rpc --rpcaddr=0.0.0.0 --maxpeers 1000 --allow-insecure-unlock &
cd ~/AsmBrowser
pm2 start app.js
```
