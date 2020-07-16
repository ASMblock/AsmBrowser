
$(function(){
    let chinese = ['区块浏览器','首页','区块链','区块','交易','关于我们','区块哈希/区块高度/交易哈希/地址','今日价格',
    '流通总量','网络状态','平均出块时间','未确认交易','昨日总算力','销毁总量','昨日算力排行榜','最近出块','全部',
    '区块哈希','总交易量','最近交易','发送方','接收方','搜索','个区块','笔交易','昨日挖矿产量','生成时间','交易次数','账户','账户详情','持有代币价值','持有代币种类','代币持仓分布'
    ,'交易额','交易类型','交易信息','哈希树根','所在区块','交易费用','交易明细','输入','输出','交易附言','数量','手续费','上一个区块','下一个区块','区块高度'
    ,'版本','确认数', '哈希','交易哈希','时间','区块概览','哈希','随机数','交易列表','地址','余额','交易记录', '数额']
    let english = [
        'Explorer','Home','Blockchain','Block','Pay','About us','Block hash/block height/transaction hash/address',
        'Today price','Total circulation','Network','Average Block Time','Unconfirmed Pay','Yesterday Power','Total Destruction',
        "Yesterday's power rankings",'Latest Blocks','All','Block hash','total','Latest Transactions','Sender','Receiver','search',
    'block','pay','Yesterday Output ','Create time','Pay count','Account','Account Detail','Coin Value:','Coin Type:','Coin Distribute:','Value',
    'type','Transaction','hash','Block Height','fee','Transaction Detail','to','get','Data','Pay count','Fee count','Previous Block','Next Block','Block Height','Version','Pay count','Block hash','Hash',
'Time','Block Overview','Hash','random number','Pay List','Address','Balance','Transaction Record', 'Amount']

    $('.menustatus').on('click',function(){
        $(this).toggleClass('open');
        $('.m_nav .menudropdown').toggleClass('show');
    })
    let webUrl=window.location.protocol+"//"+window.location.hostname+':3000';
    let url = webUrl;
    $(document).keyup(function(event){
        if(event.keyCode ==13){
          console.log($("#inputValue")[0].value)
          // $("#inputValue").
          
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
        } else if( e.target.innerText === 'English' ) {
            for(let k = 0; k <  $('.ml72').length; k++ ) {
                $($('.ml72')[k]).css('paddingLeft', '72px')
            }
            for(let v = 0; v <  $('.ml56').length; v++ ) {
                $($('.ml56')[v]).css('paddingLeft', '56px')
            }
            for(let i = 1;i < english.length+1; i++ ) {
                for(let j = 0; j< $('.tra'+[i]).length; j++ ) {
                    if ( i === 26 ) {
                        console.log(english[i-1])
                    }
                    if ( i === 7 ) {
                        $('.tra'+[i])[j].placeholder = english[i-1];
                    } else {
                        $('.tra'+[i])[j].innerText = english[i-1];
                    }
                }
            }
            $("input[name='s']").attr('checked',false)
        };
        $(this).parents('.languagelist').siblings('span').text($(this).text());
        $(this).parents('.languagelist').hide();
    })

    $("#translateInput").click(function(data){
        //获取switch的值
        var ck=document.querySelector("input[name='s']:checked")==null?true:false;
        if(ck){
            for(let k = 0; k <  $('.ml72').length; k++ ) {
                $($('.ml72')[k]).css('paddingLeft', '72px')
            }
            for(let v = 0; v <  $('.ml56').length; v++ ) {
                $($('.ml56')[v]).css('paddingLeft', '56px')
            }
            for(let i = 1;i < english.length + 1; i++ ) {
                for(let j = 0; j< $('.tra'+[i]).length; j++ ) {
                    if ( i === 7 ) {
                        $('.tra'+[i])[j].placeholder = english[i-1];
                    } else {
                        $('.tra'+[i])[j].innerText = english[i-1];
                    }
                }
            }
            $('#translateI').text('English');
        }else{
            for(let k = 0; k <  $('.ml72').length; k++ ) {
                $($('.ml72')[k]).css('paddingLeft', '46px')
            }
            for(let v = 0; v <  $('.ml56').length; v++ ) {
                $($('.ml56')[v]).css('paddingLeft', '46px')
            }
            for(let i = 1;i < chinese.length +1; i++ ) {
                for(let j = 0; j< $('.tra'+[i]).length; j++ ) {
                    if ( i === 7 ) {
                        $('.tra'+[i])[j].placeholder = chinese[i-1];
                    } else {
                        $('.tra'+[i])[j].innerText = chinese[i-1];
                    }
                }
            }
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

    for(let k = 0; k <  $('.ml72').length; k++ ) {
        $($('.ml72')[k]).css('paddingLeft', '72px')
    }
    for(let v = 0; v <  $('.ml56').length; v++ ) {
        $($('.ml56')[v]).css('paddingLeft', '56px')
    }
    for(let i = 1;i < english.length+1; i++ ) {
        for(let j = 0; j< $('.tra'+[i]).length; j++ ) {
            if ( i === 26 ) {
                console.log(english[i-1])
            }
            if ( i === 7 ) {
                $('.tra'+[i])[j].placeholder = english[i-1];
            } else {
                $('.tra'+[i])[j].innerText = english[i-1];
            }
        }
    }
    $("input[name='s']").attr('checked',false)

})





