var request = require('request');
request = request.defaults({
    jar: true
});
var schedule = require("node-schedule");
var cheerio = require("cheerio")
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');
var goods = require("./goods")
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//var phantom = require('phantom');
var dbutil = require("./dbutil");
var paimai = require("./paimai");
const exec = require('child_process').exec;
var page;
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/dbd', express.static(path.join(__dirname, 'dbd')));

var goodsCount;


app.get('/', function (req, res) {

    // dbutil.getCountMaxId(function (data) {
    //     data.title = "Ejs"
    //     var parmaiId = req.query.command;
    //     res.cookie("dd", "bb");
    //     res.render('index', data);
    // })

    res.render('index');
})
app.get("/getInfo", function (req, res) {
    if (!goodsCount) {
        dbutil.getCount(function (err, results) {
            console.log(results)
            goodsCount = results[0]['count(paimaiId)'];
        })
    }
    dbutil.getNullCount(function (err, results) {
        var nullCount = results[0]['count(paimaiId)']
        var data = {
            goodsCount,
            nullCount
        };
        results[0]['max(paimaiId)'];

        res.send(JSON.stringify(data));
    })
    // dbutil.getCountMaxId(function (data) {
    //     res.send(JSON.stringify(data));
    // })
})
app.get("/reboot", function (req, res) {
    res.send("ok");
    exec("sh reboot.sh")
    setTimeout(function () {
        process.kill(process.pid)
    }, 1000)

})
app.get("/saveGoods", function (req, res) {
    dbutil.getCountMaxId(function (data) {

        var start = data.maxId || 10000000;
        var end = parseInt(req.query.end) || 16000000;
        goods.saveGoodsByIds(start, end, function () {
            res.send(start + "," + end);
        });

    })
})
app.get("/updateNameStart", function (req, res) {
    goods.updateNameStart();
})

app.all("/login", function (req, res) {
    //paimai.login()
    res.render("login")
})
app.all("/addAccount", function (req, res) {
    
})
app.get("/inputCode", function (req, res) {
    var code = req.query.code;
    paimai.inputCode(code)
    console.log(code)
    res.send(code + "ok");
})
app.get("/execJs", function (req, res) {
    paimai.execJs(req.query.js, (html) => {
        res.send(html);
    });
})
app.get("/paiGoods", function (req, res) {
    var paimaiId = req.query.paimaiId;
    var jiage = req.query.jiage;
    paimai.paiGoods({
        paimaiId: paimaiId,
        jiage: jiage
    }, function (msg) {
        res.send(msg)
    })
    //    res.send("ok");
})

app.get('/jiagebiao', function (req, res) {
    request.post("http://jd.svipnet.com/list.php", {
        form: {
            "shopName": "surface pro",
            "use": "all",
            "days": "90",
            "numbers": "18"
        }
    }, function (err, httpResponse, body) {
        res.send(body);
    })
})

//[{href:"",name:"",}]
app.get('/goodshrefs', function (req, res) {
    request("https://dbd.jd.com/auctionList.html?searchParam=surface%20%20Mac&enc=utf-8", function (err, httpResponse, body) {
        //$(body).find("div").text();
        var $ = cheerio.load(body);
        var aArr = $(".name a");
        var hrefArr = [];
        var productIdArr = [];
        var infoJson, name, href, productId;
        for (var i = 0; i < aArr.length; i++) {
            href = aArr[i].attribs.href;
            name = aArr[i].children[0].nodeValue;
            productId = href.substr(href.lastIndexOf("/") + 1, href.length);
            infoJson = {
                name: name,
                href: href,
                productId: productId
            }
            hrefArr.push(infoJson);
            productIdArr.push(productId);
        }
        productIdArr.join("-");
        res.send(JSON.stringify(hrefArr));
    })
})


//批量查询商品信息    var url = 'https://dbditem.jd.com/services/currentList.action?paimaiIds=15493452-15493452&callback=showData&t=1496663855472&callback=jQuery3161076&_=1496663855473';

app.get("/jsonpinfo", function (req, res) {
    var paimaiId = req.query.paimaiId;
    var url = "http://bid.jd.com/json/current/englishquery?paimaiId=" + paimaiId + "&skuId=0&t=370185&start=0&end=9&callback=jQuery8847406&_=1496722968852";
    var strTime = new Date().getTime();
    request(url, function (err, httpResponse, body) {
        console.log(new Date().getTime() - strTime)
        res.send(body);
    })
})
app.get("/testCookie", function (req, res) {
    //var url = "http://127.0.0.1/test.php"
    //这个页面用到了cookie 实验成功
    var url = "http://home.jd.com"

    request({
            url: url,
            headers: {
                cookie: "__jdv=122270672|direct|-|none|-|1500517641040; TrackID=1KjWZBLa7W99sQmn7J4IGash52mDhVmzKqiAalHb2f3_wGT636uY28jN1S07eCBbxCWzvdc_16HmjtXFEczAA-hpKeQuuXYf4UbQ9Kqw3VIsHsIxZ1QQ_mp7y4UzeVBdM; pinId=PeNQr3jpP0Z4t4Y06rqR_Q; pin=paipai000; unick=paipai000; thor=9C9CF8D8F75B1D305A51D7331EC0E9B547E2E52D706DD9AC98EDEEA6C281BB9DD8B23D7EBEAADD4C06AD7A79E916D6B6DD7AFEB7D540B10D2B7B3F5DFC0C3808282B96BF8C044507DB4876FFAF7C59902F72E6F0567B486FA40C28ABACF5EB15CFDEF7F9166EE4AEF789F6D4D4C321AA1C78D6293859BCDBFD6B797EA3C917FE3890A2E8AE43E424C424D866078584D6; _tp=e5O%2Bed%2BozMR7XBkXAIctvQ%3D%3D; _pst=paipai000; ceshi3.com=000; user-key=10edd1fc-2620-4743-b2b7-4d4591c50f9e; cn=2; ipLoc-djd=1-72-4137-0; areaId=1; 3AB9D23F7A4B3C9B=JYFTRZO2CJN7ZDT2C256WO6NNP467TQIEE6D2QIQLUPIC7MXBS2SYNPINZVQ3JJIUU2XTH4CAX6UNRE62UJJI2SQTE; __jda=122270672.1500517641039962056337.1500517641.1500517641.1500517641.1; __jdb=122270672.12.1500517641039962056337|1.1500517641; __jdc=122270672; __jdu=1500517641039962056337; userInfoaccountclouds=1"
            }
        },
        function (err, httpResponse, body) {
            //console.log(httpResponse)
            console.log(httpResponse.headers)
            res.send(body);
            // request(url, function (err, httpResponse, body) {
            //     console.log(body)
            // })
        }
    )
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
    // paimai.login(function (cookie) {
    //     console.log(cookie)
    // });

    //schedule.scheduleJob('0,10,20,30,40,50 * * * * *', function () {
    //console.log('scheduleCronstyle:' + new Date());
    //});
    //pageRun();
})


// document.getElementById("loginname").value
// document.getElementById("nloginpwd").value
// $("#loginsubmit").trigger("click")