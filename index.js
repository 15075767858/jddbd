var request = require('request');
var schedule = require("node-schedule");
var cheerio = require("cheerio")
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index', { title: 'EJS' });
})

app.get('/jiagebiao', function (req, res) {
    request.post("http://jd.svipnet.com/list.php", {
        form: {
            "shopName": "surface pro", "use": "all", "days": "90", "numbers": "18"
        }
    }, function (err, httpResponse, body) {
        res.send(body);
    }
    )
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
    schedule.scheduleJob('0,10,20,30,40,50 * * * * *', function () {
        console.log('scheduleCronstyle:' + new Date());
    });
})
