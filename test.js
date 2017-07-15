var webPage = require('webpage');
var page = webPage.create();


page.open("http://127.0.0.1:8081/", function (status) {

    console.log(page.getPage(page.windowName));
    // page.evaluateAsync(function () {
    // })
    //page.evaluateJavaScript('function(){document.body.innerHTML="123"}')
    page.evaluate(function () {
        document.body.innerHTML = "222"
    })

    page.evaluateAsync(function (apiUrl) {
        document.body.innerHTML = "333"
    }, 1000, "/");
    page.injectJs("chajian/charu.js", function () {
        
    })

    console.log("111")
    // page.includeJs("http://www.smartio.cc/style/js/jquery.min.js", function () {
    //     console.log("argu")

    //     page.evaluateAsync(function () {

    //         $.ajax({
    //             url: "/",
    //             success: function () {
    //                 //$("*").html("12313")
    //             }
    //         });


    //     });
    //     page.evaluateAsync(function (apiUrl) {

    //         $.ajax({
    //             url: apiUrl, success: function () {
    //                 $("*").html(apiUrl)

    //             }
    //         });
    //     }, 1000, "/");
    // });

    setInterval(function () {
        console.log(page.content);
    }, 5000)
});

// @TODO: Finish page.canGoBack example.

// page.open('https://passport.jd.com/uc/login?ltype=logout', function (status) {
//     console.log("Status: " + status);

//     //phantom.exit();
//     if (status === "success") {
//         setInterval(function () {
//             page.render('example.png');

//             page.evaluate(function () {
//                 console.log(document.cookie)
//                 console.log(document.title)
//                 return document.titele;
//             });
//         }, 10000)
//     }
// });

// page.onConsoleMessage = function (msg) {
//     console.log(msg);
// };

