$(function () {
    let webUrl=window.location.protocol+"//"+window.location.hostname+':3000';
    let url = webUrl;
    $('.menustatus').on('click',function(){
      $(this).toggleClass('open');
      $('.m_nav .menudropdown').toggleClass('show');
      $('body').toggleClass('fixedScroll');
    })

  $(document).keyup(function(event){
    if(event.keyCode ==13){
      console.log($("#inputValue")[0].value)
      
      $.ajax({
        url: url + "/getBrowserSearch",
        type: "GET",
        data: {'search': $("#inputValue")[0].value},
        dataType:"json",
        success:function(result){
            if( result.code === 1 ) {
               if(result.data.type === 1) {
                window.location.href = 'block_details.html?address='+ $("#inputValue")[0].value;
               } else if (result.data.type === 2) {
                window.location.href = 'index_details.html?address='+ $("#inputValue")[0].value;
              } else if (result.data.type === 3) {
                window.location.href = 'payDetails.html?address='+ $("#inputValue")[0].value;
              }
            } else {
                $('#notMsg').html('<div style="display: flex; align-items: center; justify-content: center;height:calc(100vh - 200px);font-size:22px;color:#fff;">'+result.msg+'</div>')
            }
        },
        error:function(error){
            alert('请求参数出错')
          }

    });
    }
  });
  $('#new-search-icon').on('click',function(){
    $.ajax({
        url: url + "/getBrowserSearch",
        type: "GET",
        data: {'search': $("#inputValue")[0].value},
        dataType:"json",
        success:function(result){
            if( result.code === 1 ) {
               if(result.data.type === 1) {
                window.location.href = 'block_details.html?address='+ $("#inputValue")[0].value;
               } else if (result.data.type === 2) {
                window.location.href = 'index_details.html?address='+ $("#inputValue")[0].value;
              } else if (result.data.type === 3) {
                window.location.href = 'payDetails.html?address='+ $("#inputValue")[0].value;
              }
            } else {
                $('#notMsg').html('<div style="display: flex; align-items: center; justify-content: center;height:calc(100vh - 200px);font-size:22px;color:#fff;">'+result.msg+'</div>')
            }
        },
        error:function(error){
            alert('请求参数出错')
          }

    });
  })
  $('#search').on('click',function(){
    $.ajax({
      url: url + "/getBrowserSearch",
      type: "GET",
      data: {'search': $("#inputValue1")[0].value},
      dataType:"json",
      success:function(result){
        console.log(result)
          if( result.code === 1 ) {
             if(result.data.type === 1) {
              window.location.href = 'block_details.html?address='+ $("#inputValue1")[0].value;
             } else if (result.data.type === 2) {
              window.location.href = 'index_details.html?address='+ $("#inputValue1")[0].value;
            } else if (result.data.type === 3) {
              window.location.href = 'payDetails.html?address='+ $("#inputValue1")[0].value;
            }
          } else {
            $('.menustatus').toggleClass('open');
            $('.m_nav .menudropdown').toggleClass('show');
            $('body').toggleClass('fixedScroll');
            $('#notMsg').html('<div style="display: flex; align-items: center; justify-content: center;height:calc(100vh - 200px);font-size:18px;color:#fff;">'+result.msg+'</div>')
          }
      },
      error:function(error){
        alert('请求参数出错')
        }

  });
  })
  
  $('.languagelist ul li a').on('click',function(e){
    
    if( e.target.innerText === '简体中文') {
        getIndexData('cn',2)
        $("input[name='s']").attr('checked',true)
    } else if( e.target.innerText === 'English' ) {
        getIndexData('en',1)
        $("input[name='s']").attr('checked',false)
    };
    $(this).parents('.languagelist').siblings('span').text($(this).text());
    $(this).parents('.languagelist').hide();
  })
  $("#translateInput").click(function(data){
   
    var ck=document.querySelector("input[name='s']:checked")==null?true:false;
    if(ck){
        getIndexData('en',1)
        $('#translateI').text('English');
    }else{
        getIndexData('cn',2)
        $('#translateI').text('简体中文');
    }
  })
  $('.language .selected').hover(function(){
      $(this).children('.languagelist').show();
  },function(){
      $(this).children('.languagelist').hide();
  })

  $(function () {
      $('[data-toggle="tooltip"]').tooltip()
  })
  $('.account_tab').on('click','li',function(){
      $(this).addClass('active').siblings().removeClass('active');
      $('.datalistbox .dataitem').eq($(this).index()).addClass('show').siblings().removeClass('show');
  })
    let chinese = ['区块浏览器','首页','区块链','区块','交易','关于我们','区块哈希/区块高度/交易哈希/地址','今日价格',
    '流通总量','网络状态','平均出块时间','未确认交易','昨日总算力','销毁总量','昨日算力排行榜','最近出块','全部',
    '区块哈希','总交易量','最近交易','发送方','接收方','搜索','个区块','笔交易','昨日挖矿产量','已挖总量','碰撞池剩余ASM总量','矿池剩余ASM总量']
    let english = [
        'Explorer','Home','Blockchain','Block','Pay','About us','Block hash/block height/transaction hash/address',
        'Today price','Total circulation','Network','Average Block Time','Unconfirmed Pay','Yesterday Power','Total Destruction',
        "Yesterday's power rankings",'Latest Blocks','All','BlockHash','total','Latest Transactions','sender','receiver','search',
    'block','pay','Yesterday Output ','Total mined amount','Collision Pool', 'Mining Pool']

    function goEn () {
      for(let k = 0; k <  $('.ml72').length; k++ ) {
        $($('.ml72')[k]).css('paddingLeft', '72px')
      }
      for(let v = 0; v <  $('.ml56').length; v++ ) {
          $($('.ml56')[v]).css('paddingLeft', '56px')
      }
      for(let i = 1;i < english.length+1; i++ ) {
          for(let j = 0; j< $('.tra'+[i]).length; j++ ) {
              if ( i === 26 ) {
              }
              if ( i === 7 ) {
                  $('.tra'+[i])[j].placeholder = english[i-1];
              } else {
                  $('.tra'+[i])[j].innerText = english[i-1];
              }
          }
      }
      $("input[name='s']").attr('checked',false)
    }
    function goCn () {
      for(let k = 0; k <  $('.ml72').length; k++ ) {
        $($('.ml72')[k]).css('paddingLeft', '46px')
      }
      for(let v = 0; v <  $('.ml56').length; v++ ) {
          $($('.ml56')[v]).css('paddingLeft', '46px')
      }
      for(let i = 1;i < chinese.length+1; i++ ) {
          for(let j = 0; j< $('.tra'+[i]).length; j++ ) {
              if ( i === 7 ) {
                  $('.tra'+[i])[j].placeholder = chinese[i-1];
              } else {
                  $('.tra'+[i])[j].innerText = chinese[i-1];
              }
          }
      }
      $("input[name='s']").attr('checked',true)
    }
  
    $('.languagelist ul li a').on('click',function(e){
      if( e.target.innerText === '简体中文') {
          getIndexData('cn',2)
          $("input[name='s']").attr('checked',true)
      } else if( e.target.innerText === 'English' ) {
          getIndexData('en',1)
          $("input[name='s']").attr('checked',false)
      };
      $(this).parents('.languagelist').siblings('span').text($(this).text());
      $(this).parents('.languagelist').hide();
  })
    function getIndexData (lang,type) {
        $.ajax({
            url: url + "/getIndexData",
            type: "GET",
            data: {'lang': lang},
            dataType:"json",
            success:function(result){
                if( result.code === 1 ) {
                    let data = result.data;
                    $('#now_price').html('$ ' + data.now_price);
                    let datax = [];
                    let datay = [];
                    if( data.table_ret ) {
                        data.table_ret.forEach((item, i) => {
                            datax.push(item.date);
                            datay.push(item.value);
                        });
                        createdEchart(datax,datay)
                    }
                    $('#avg_block_time').html(data.count_ret.avg_block_time);
                    $('#block_count').html(data.count_ret.block_count);
                    $('#db_count').html(data.count_ret.db_count);
                    $('#destory_count').html(data.count_ret.destory_count);
                    $('#num_assets').html(data.count_ret.num_assets);
                    $('#pay_count').html(data.count_ret.pay_count);
                    $('#unconfirmed_pay').html(data.count_ret.unconfirmed_pay);
                    $('#yestoday_power').html(data.count_ret.yestoday_power);
                    $('#hadmine_count').html(data.count_ret.hadmine_count);
                    $('#number1').html(data.count_ret.number1);
                    $('#number2').html(data.count_ret.number2);
                    createdSort(data.sort_ret);
                    createdBlock(data.block_ret,type);
                    createdPay(data.pay_ret,type);
                } else {
                  alert(result.msg)
                }
                
            },
            error:function(error){
                console.log(error)
              alert('请求参数出错')
            }

        });
    }
    function createdEchart (xdata, ydata) {
        var myChart = echarts.init(document.getElementById('echarts'));
        option = {
          xAxis: {
              type: 'category',
              data: xdata,
              boundaryGap: false,
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: 'rgba(255,255,255,.3)',//X轴边线的颜色
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#fff',//坐标值得具体的颜色
                }
              }
          },
          yAxis: {
            type: 'value',
            splitLine:{
      　　　　show:false
        　　},
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: 'rgba(255,255,255,.3)',//X轴边线的颜色
              }
            },
          },
          series: [{
            data: ydata,
            type: 'line',
            smooth: true,
            symbolSize: 3, //折线点的大小
            itemStyle: {
              normal: {
                color: "rgba(255,204,0)", //折线点的颜色
                lineStyle: {
                  color: "rgba(255,204,0)" //折线的颜色
                }
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(255,204,0,.2)' //改变区域颜色
              }
            },
          }],
          grid:{
            top:"20px",
            left:"30px",
            right:"20px",
            bottom:"20px"
          },
          tooltip: {
            trigger: 'axis', 
          },
          textStyle:{
            fontSize:14,
            color:'rgba(255,255,255,0)', //Y轴字体
          },
        };
        myChart.setOption(option);
      
        window.addEventListener('resize', function () {myChart.resize()});
    }
    function createdSort (data) {
        let str = '';
        data.forEach((item, i) => {
            str += '<a href="index_details.html?address='+ item.address +'" class="rankitem">' + 
                        '<h4>' + item.address + '</h4>' +
                        '<div>'+ item.num + '</div>' +
                    '</a>'
        })
        $('#sort_ret').html(str)
    }
    function createdBlock (data,type) {
        let str = '';
        data.forEach((item, i) => {
            if ( i < 10 ) {
                str +=  '<li>' + 
                    '<a href="block_details.html?address='+ item.blockid +'" class="number">' +
                    '<div ><em class="tra4">区块</em><span>' + item.blockid + '</span></div>' + 
                    '<span>&gt; <span class="minute">'+ item.time +'</span></span>'+
                    '</a>'+
                    '<div class="head ml72"><span class="tra18">播报方</span><a href="block_details.html?address='+ item.blockhash  +'">'+ item.blockhash + '</a></div>'+
                    '<div class="cup">ASM Super Miners'+
                    '<i></i>'+
                    
                    '<div class="dealmath">Total' + item.pay_count + '<em > Transactions</em></div>'+
                    '</div>'+
                '</li>'
            }
        })
        
        $('#block_ret').html(str)
        if (type == 1) {
          goEn()
        } else if ( type == 2) {
          goCn()
        }
    }
    
    
    function createdPay (data,type) {
        let str = '';
        data.forEach((item, i) => {
            if ( i < 10 ) {
                str +=  '<li>' + 
                '<a href="payDetails.html?address='+ item.pay_id +'" class="number">' + 
                 '<div>'+ item.coin_num +' ASM</div>' + 
                  '<span>'+ item.time + '( &gt; <span class="minute">'+ item.last_time + '</span>)</span>' + 
                '</a>' + 
                '<div class="head"><span class="tra5">交易#</span><a href="payDetails.html?address='+item.pay_id+'" id="goPayDetails">'+ item.pay_id + '</a></div>'+
                '<div class="dealman clearfix">' + 
                 '<div class="send"><span class="tra21">发送方</span><a href="index_details.html?address='+item.to_address+'">'+ item.to_address + '</a></div>'+
                  '<div class="receive ml56" "><span class="tra22">接收方</span><a href="index_details.html?address='+ item.get_address +' ">' + item.get_address + '</a></div>' +
                '</div>'+
                '</li>'
            }
        })
        $('#pay_ret').html(str)
        if (type == 1) {
          goEn()
        } else if ( type == 2) {
          goCn()
        }
          
        
    }
    
    getIndexData('en',1)
})
