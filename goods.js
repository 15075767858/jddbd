var cheerio = require("cheerio");

var request = require('request');
var dbutil = require("./dbutil");

//getOneGoodsInfo({ url: "http://dbditem.jd.com/15965761" })


function saveGoodsByIds(start, end, callback) {
    var arr = [];
    for (var i = start; i < start + 60; i++) {
        arr.push(i);
    }

    if (start >= end) {
        if (callback)
            callback(start, end);
        return;
    }
    //console.log(start, arr.join("-"))
    getGoodsInfos(arr.join("-"), function (arr) {
        arr = arr.filter(function (v) {
            if (v) {
                return true;
            } else {
                return false;
            }
        })
        if (arr.length == 0) {
            saveGoodsByIds(start + 60, end);
        } else {
            saveGoosByInfoArr(arr, function () {
                saveGoodsByIds(start + 60, end);
            });
        }
    })
}

function getGoodsInfos(ids, callback) {
    var url = "http://dbditem.jd.com/services/currentList.action?paimaiIds=" + ids + "&callback=a"
    request(url, function (err, response, body) {
        //console.log(body)
        var arr = eval(body.substring(2, body.length - 1));
        callback(arr);
    })
}

function saveGoosByInfoArr(arr, callback) {
    var count = 0;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
            dbutil.saveOneGoos({
                data: arr[i]
            }, function (err) {
                if (err)
                    console.log(err)
                count++;
                //                console.log(count, arr.length)
                if (count == arr.length) {
                    callback()
                }
            });
        }
    }
}




function UpdateGoodsNameUse(info, callback) {
    //var info = GoodsArr[0]
    //console.log(GoodsArr.length, info.paimaiId)
    var url = "http://dbditem.jd.com/" + info.paimaiId;
    getOneGoodsInfo({
        url
    }, function (data) {
        data.paimaiId = info.paimaiId;
        dbutil.updateNameAndUse(data, function () {
            callback()
            //updateNameStart()
        })
    })
}


function updateNameStart() {
    //目前1500条 不打印3500条 
    dbutil.getNullGoods(function (err, results, fields) {
        var info;
        var count = 0;
        var len = results.length;
        console.log(results.length)
        while (info = results.pop()) {
            UpdateGoodsNameUse(info, function () {
                count++
                if (count == len) {
                    updateNameStart()
                }
            })
        }
        //console.log("再来")


    })

}

function getOneGoodsInfo(option, callback) {
    var url = option.url;
    request(url, function (err, response, body) {

        var data = getPageInfo(body);
        callback(data);
    })
}

function getPageInfo(html) {
    try {

        var name, use;
        var $ = cheerio.load(html);

        var dname = $("div.name");
        if (dname.length > 0) {
            name = dname[0].attribs.title;
        }
        var i = $("div.name i")
        if (i.length > 0) {
            use = i[0].childNodes[0].data
        }
        return {
            goodsName: name,
            goodsUse: use
        };
    }catch(e){
        return {goodsName:"",goodsUse:""}
    }
}

exports.saveGoodsByIds = saveGoodsByIds;
exports.UpdateGoodsNameUse = UpdateGoodsNameUse;
exports.updateNameStart = updateNameStart;