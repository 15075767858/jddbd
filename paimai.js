var phantom = require('phantom');
var phInstance = null;
var request = require('request');
var fs = require("fs");
var loginFile = "./login.json";
var sitepage = null;


function login(callback) {
    phantom.create().then(function (instance) {
        phInstance = instance;

        return instance.createPage()
    }).then(function (page) {
        sitepage = page;
        var url = "http://passport.jd.com/uc/login";
        page.invokeAsyncMethod('open', url).then(function (status) {
            console.log(status)
            page.render('public/login.jpeg', {
                format: 'jpeg',
                quality: '30'
            });

            var inter1 = setInterval(function () {
                page.cookies().then(function (cookies) {
                    //console.log(cookies)
                    var loginCookie;
                    while (loginCookie = cookies.pop()) {
                        if (loginCookie.name == "thor") {
                            console.log("登录成功")
                            fs.appendFileSync(loginFile, JSON.stringify(loginCookie));
                            clearInterval(inter1)
                            fs.unlinkSync("public/login.jpeg");
                            keepLogin(page)
                            break;
                        }
                    }
                })
                page.property('url').then(function (resUrl) {
                    console.log(resUrl)
                    url = resUrl;
                })
                page.reload()
                    
                page.render('public/login.jpeg');
            }, 10000)
        });
        page.property('onResourceRequested', function (requestData, networkRequest) {
            //console.log(arguments)
            //console.log(requestData.url);
        });
        page.property('onResourceReceived', function (requestData, networkRequest) {
            //console.log(arguments)
            //console.log(requestData.url);
        });
        page.on("onConsoleMessage", function (msg) {
            console.log(msg)
        })
    })
}

function inputCode(code) {
    sitepage.evaluate(function (codeNum) {
        //添加短信登录功能
        var code = document.getElementById("code")
        console.log(code)
        code.value = codeNum;
        var a = document.getElementById("submitBtn")
        console.log(a)
        a.onclick()
        return codeNum;
    }, code).then(function (html) {
        console.log(html);
    });
}

function execJs(js, callback) {
    sitepage.evaluateJavaScript(js).then(function (html) {
        callback(html);
    })
}

function paiGoods(option, callback) {
    console.log(option)
    var paimaiId = option.paimaiId;
    var jiage = option.jiage;
    var resMessage="";
    phInstance.createPage().then(function (page) {
        page.invokeAsyncMethod("open", "http://dbditem.jd.com/" + paimaiId).then(function () {
            //console.log(page)
            page.injectJs("./chajian/qiang.js").then(function () {

            })
            page.evaluate(function (jiage) {
                destPrice = jiage
                console.log("sdfas")
                startPaiMai();
                return jiage;

            }, jiage).then(function (html) {
                console.log(html);
            });
        })

        page.on("onConsoleMessage", function (msg) {
            //resMessage+=msg+"<br>";
            resMessage=msg+"<br>"+resMessage
            if (msg.substr(0, 2) == "完成") {
                callback(resMessage)
                //setTimeout(function () {
                // page.render("public/"+new Date().toLocaleString() + ".jpeg", {
                //     format: 'jpeg',
                //     quality: '50'
                // })
                page.close()
                //}, 10000)
            }
            console.log(msg)
        });
    })
}


function keepLogin(page) {

    setInterval(function () {
        page.property('url').then(function (resUrl) {
            console.log(resUrl)
        })
        //page.reload();
        page.render('public/keeplogin.jpeg', {
            format: 'jpeg',
            quality: '1'
        });
    }, 60000)
}
exports.login = login;
exports.sitepage = sitepage;
exports.paiGoods = paiGoods;
exports.inputCode = inputCode;
exports.execJs = execJs;
// var webPage = require('webpage');
// var page = webPage.create();


// page.open("http://127.0.0.1:8081/", function (status) {

//     console.log(page.getPage(page.windowName));
//     // page.evaluateAsync(function () {
//     // })
//     //page.evaluateJavaScript('function(){document.body.innerHTML="123"}')
//     page.evaluate(function () {
//         document.body.innerHTML = "222"
//     })

//     page.evaluateAsync(function (apiUrl) {
//         document.body.innerHTML = "333"
//     }, 1000, "/");
//     page.injectJs("chajian/charu.js", function () {

//     })

//     console.log("111")
//     // page.includeJs("http://www.smartio.cc/style/js/jquery.min.js", function () {
//     //     console.log("argu")

//     //     page.evaluateAsync(function () {

//     //         $.ajax({
//     //             url: "/",
//     //             success: function () {
//     //                 //$("*").html("12313")
//     //             }
//     //         });


//     //     });
//     //     page.evaluateAsync(function (apiUrl) {

//     //         $.ajax({
//     //             url: apiUrl, success: function () {
//     //                 $("*").html(apiUrl)

//     //             }
//     //         });
//     //     }, 1000, "/");
//     // });

//     setInterval(function () {
//         console.log(page.content);
//     }, 5000)
// });

// // @TODO: Finish page.canGoBack example.

// // page.open('https://passport.jd.com/uc/login?ltype=logout', function (status) {
// //     console.log("Status: " + status);

// //     //phantom.exit();
// //     if (status === "success") {
// //         setInterval(function () {
// //             page.render('example.png');

// //             page.evaluate(function () {
// //                 console.log(document.cookie)
// //                 console.log(document.title)
// //                 return document.titele;
// //             });
// //         }, 10000)
// //     }
// // });

// // page.onConsoleMessage = function (msg) {
// //     console.log(msg);
// // };