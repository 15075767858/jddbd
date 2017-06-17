var webPage = require('webpage');
var page = webPage.create();
page.open("http://www.jd.com", function () {


    page.open("http://127.0.0.1:8081/", function (status) {


        page.includeJs("http://www.smartio.cc/style/js/jquery.min.js", function () {
            console.log("argu")
            page.evaluateAsync(function () {
                console.log("11111")

                $.ajax({ url: "api1", success: function () { } });


            });
            page.evaluateAsync(function (apiUrl) {
                console.log("apiurl = ")
                $.ajax({ url: apiUrl, success: function () { } });
            }, 1000, "api2");
        });
    });
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

