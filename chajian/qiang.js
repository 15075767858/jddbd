//这个方法用来 获取当前竞拍商品的状态
//
// var sPr = 30000;
// for (var i = 0; i < 365 / 10; i++) {
//     sPr = sPr * 0.1 + sPr;
//     console.log(sPr, sPr / 5000)
// }
if (location.protocol == "https:")
    location.protocol = "http:"
// window.onload = function () {
//     var strT= new Date().getTime()
//     $.getJSONP("http://www.smartio.cc/a/test.php", function () {
//         console.log(arguments)
//          var dif = new Date().getTime()-strT
//          console.log(dif);
//     });

// }



m_initElements();




function m_initElements() {
    window.delayNum = 0;
    var m_name = $(".name h1")[0].childNodes[2].textContent.trim();
    window.m_name = m_name;
    var m_infoUrl = "http://www.smartio.cc/a/test.php?name=" + m_name;
    var m_win = window.open(m_infoUrl);
    window.onbeforeunload = function () {
        m_win.close();
    }
    var m_bt1 = document.createElement("button");
    m_bt1.innerHTML = "我要开始抢啊啊啊啊啊啊啊啊!!!"
    //var m_input1 = document.createElement("input");
    var m_info = document.createElement("textarea");
    m_info.style.height = "100px"
    m_info.style.width = "500px"
    document.body.insertBefore(m_info, document.body.childNodes[0]);
    document.body.insertBefore(m_bt1, document.body.childNodes[0]);
    //document.body.insertBefore(m_input1, document.body.childNodes[0]);
    m_bt1.onclick = function () {
        if (m_win)
            m_win.close();
        var destPrice = prompt();//m_input1.value; 目标价格
        window.destPrice = destPrice;
        if (!destPrice) {
            console.log("卧槽 不抢了 ");
        } else {
            console.log("开始抢 价格=", destPrice);
            pageCurrentReload();
            startPaiMai();
        }
    }
    window.addInfo = function (info) {
        if (m_info.value.length > 1000) {
            m_info.value = "";
        }
        var m_time = new Date().toLocaleString()
        m_info.value = m_time + "  " + info + "\n";
    }
}



var paimaiId = $("#paimaiId").val();
function startPaiMai() {
    window.sTime = new Date().getTime();

    var url = "//www.smartio.cc:8081/jsonpinfo?paimaiId=" + paimaiId;
    $.ajax({url: url, dataType: "jsonp"})

    var url = "//bid.jd.com/json/current/englishquery?paimaiId=" + paimaiId + "&skuId=0&t=" + getRamdomNumber() + "&start=" + queryStart + "&end=" + queryEnd;
    $.ajax({
        url: url, dataType: "jsonp",
        success: function (response) {
            var eTime = new Date().getTime();
            window.delayNum = eTime - window.sTime;
            var endTime = response.remainTime / 1000;
            console.log(response)
            if (response.auctionStatus == 0) {
                console.log("距离开加价时间还有 ", response.remainTime / 1000, "秒");
                setTimeout(function () {
                    startPaiMai();
                }, response.remainTime + 3000);//3秒后进入等待买模式
                return;
            }
            if (response.auctionStatus == 1) {
                addInfo("距离拍卖结束时间还有=" + endTime + "秒当前延时=" + delayNum + "当前价格=" + response.currentPrice + "我的价格=" + destPrice + "商品名=" + m_name);
                console.log("距离拍卖结束时间还有 " + endTime-- + "秒，", "当前延时=", delayNum, "当前价格=", response.currentPrice, "我的价格=", destPrice);
                if (response.remainTime > 5000) {
                    setTimeout(function () {
                        startPaiMai();
                    }, 3000)
                } else {
                    console.log("还剩不到5秒,进入疯狂抢购模式");
                    mgetGs();
                }
            }
        }
    })
}
function jQuery8847406(response) {
    var eTime = new Date().getTime();
    window.delayNum = eTime - window.sTime;
    var endTime = response.remainTime / 1000;
    console.log(response)
    if (response.auctionStatus == 0) {
        console.log("距离开加价时间还有 ", response.remainTime / 1000, "秒");
        setTimeout(function () {
            startPaiMai();
        }, response.remainTime + 3000);//3秒后进入等待买模式
        return;
    }
    if (response.auctionStatus == 1) {
        addInfo("距离拍卖结束时间还有=" + endTime + "秒当前延时=" + delayNum + "当前价格=" + response.currentPrice + "我的价格=" + destPrice + "商品名=" + m_name);
        console.log("距离拍卖结束时间还有 " + endTime-- + "秒，", "当前延时=", delayNum, "当前价格=", response.currentPrice, "我的价格=", destPrice);
        if (response.remainTime > 5000) {
            setTimeout(function () {
                startPaiMai();
            }, 3000)
        } else {
            console.log("还剩不到5秒,进入疯狂抢购模式");
            mgetGs();
        }
    }
}
function mgetGs() {
    var url = "//bid.jd.com/json/current/englishquery?paimaiId=" + paimaiId + "&skuId=0&t=" + getRamdomNumber() + "&start=" + queryStart + "&end=" + queryEnd;
    $.ajax({
        url: url, dataType: "jsonp",
        success: function (response) {
            //currentPrice 当前竞拍价格
            //remainTime:"剩余时间"
            if (response.remainTime == -1) {
                console.log("结束");
                return;
            }
            console.log(response);

            if (response.remainTime < 1000 + delayNum*2 ) {

                if (response.bidList[0].username != "****i000") {

                    if (response.currentPrice < destPrice) {

                        var jiage = parseInt(response.currentPrice) + 1;
                        console.log("价格合适 并且当前买家不是我 我要买了 价格=", jiage);
                        my_sell(jiage);
                        mgetGs();
                    } else {
                        console.log("假拍一下 做个测试")
                        my_sell(1);
                        //mgetGs();
                    }
                } else {
                    console.log("当前买家是我");
                    mgetGs();
                }
                console.log("到合适的时间了", response.remainTime);
            } else {
                console.log("还没到时间 当前时间是", response.remainTime);
                mgetGs();

            }
            console.log("当前价格=", response.currentPrice, "当前时间", response.remainTime)

        }
    });
}
function my_sell(price) {
    var url = "/services/bid.action?t=" + getRamdomNumber();
    var data = { paimaiId: paimaiId, price: price, proxyFlag: 0, bidSource: 0 };
    jQuery.getJSON(url, data, function (jqXHR) {
        console.log('%c ' + jqXHR.message, 'background: #000; color: #FFF');
    });
}

