var request = require("request");
request = request.defaults({
    jar: true
})
var url = "http://127.0.0.1/test.php"
request({
        url: url,
        headers: {
            cookie:"aa=bb"
        }
    },
    function (err, httpResponse, body) {
        console.log(body)
        request(url, function (err, httpResponse, body) {
            console.log(body)
        })
    }
)