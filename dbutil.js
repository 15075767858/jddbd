var mysql = require("mysql");

var fs = require('fs');
var cheerio = require("cheerio");
var connection = getMysqlConnection();
var pool = getMysqlPoll();
var tableName = "time_zone_transition_db";
function getMysqlConnection(option) {
    var connection = mysql.createConnection(option || getMysqlXmlConfig());
    return connection;
}

function getMysqlPoll(option) {
    var pool = mysql.createPool(getMysqlXmlConfig());
    return pool;
}
function getMysqlXmlConfig() {
    var data = fs.readFileSync("./config/mysqlconfig.xml")
    var xmlstr = data.toString();
    $ = cheerio.load(xmlstr);
    var host = $("host").text()
    var username = $("username").text()
    var password = $("password").text()
    var databasename = $("databasename").text()
    return {
        host: host,
        user: username,
        password: password,
        database: databasename,
        multipleStatements: true
    }
}

function saveOneGoos(option, callback) {
    var data = option.data;
    //console.log(data)
    data.startTime = new Date(data.startTime);
    data.endTime = new Date(data.endTime);
    pool.query("insert INTO " + tableName + " SET ?", data,
        function (err) {
            callback(err);
        }
    );
}
function updateNameAndUse(option, callback) {

    var goodsUse = option.goodsUse;
    var goodsName = option.goodsName;
    goodsName = goodsName.replace(/\?/gm, "");
    console.log(goodsName)
    var paimaiId = option.paimaiId;
    var a = pool.query("update " + tableName + " set goodsUse =\"" + goodsUse + "\" , goodsName=\"" + goodsName + "\"  where paimaiId=? ", [paimaiId],
        function (err, results, fields) {
            if (err) {
                console.log(err)
            }
            //console.log(err,results,a)
            callback(err, results, fields);
        }
    );
}

String.prototype.replaceAll = function (s1, s2) {
    console.log(this)
    return this.replace(new RegExp(s1, "gm"), s2);

}
function getNullGoods(callback) {
    pool.query("select paimaiId from " + tableName + " where goodsName is null or goodsUse is null  limit 1",
        function (err, results, fields) {
            callback(err, results, fields);
        }
    );
}
function getMaxId(callback) {
    pool.query("select max(paimaiId) from " + tableName + "",
        function (err, results, fields) {
            callback(err, results, fields);
        }
    );
}
function getCount(callback) {
    pool.query("select count(paimaiId) from " + tableName + "",
        function (err, results, fields) {
            callback(err, results, fields);
        }
    );
}
function getMinNameId(callback) {
    pool.query("select Min(paimaiId) from " + tableName + " where goodsUse is Null or goodsName is Null ",
        function (err, results, fields) {
            callback(err, results, fields);
        }
    );
}
function getCountMaxId(callback) {
    var count, maxId, minNameId;
    getCount(function (err, results) {
        count = results[0]['count(paimaiId)'];
        //count=results[0]
        getMaxId(function (err, results) {
            maxId = results[0]['max(paimaiId)'];
            getMinNameId(function (err, results) {
                minNameId = results[0]['Min(paimaiId)']
                callback({ count, maxId, minNameId });
            })

        })
    })

}

exports.saveOneGoos = saveOneGoos;
exports.getNullGoods = getNullGoods;
exports.updateNameAndUse = updateNameAndUse;
exports.getCountMaxId = getCountMaxId;