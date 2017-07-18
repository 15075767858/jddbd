var request = require('request');
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
var phantom = require('phantom');
var dbutil = require("./dbutil");
var paimai = require("./paimai");
const exec = require('child_process').exec;
var page;
app.use('/public', express.static(path.join(__dirname, 'public')));

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

app.get("/login", function (req, res) {
    //paimai.login()
    res.render("login")
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
    },function(msg){
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

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
    paimai.login();

    //schedule.scheduleJob('0,10,20,30,40,50 * * * * *', function () {
    //console.log('scheduleCronstyle:' + new Date());
    //});
    //pageRun();
})

var pageRun = async function () {
    const instance = await phantom.create();
    page = await instance.createPage();

    await page.on("onResourceRequested", function (requestData) {
        //console.info('Requesting', requestData.url)
    });
    await page.on("onResourceReceived", function (response) {
        //console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
    });
    await page.on("onConsoleMessage", function (msg) {
        console.log("msg= " + msg);
    });

    const status = await page.open('https://passport.jd.com/uc/login');
    console.log(status);
    const content = await page.property('content');
    console.log(content);

    page.render('example.png');
    var cookies = await page.cookies();
    console.log(cookies)
    setInterval(function () {
        console.log(page)
        page.render('example.png');
        page.evaluate(function () {
            return document.cookies;
        });
    }, 10000)

}