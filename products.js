var nameArrs = $(".mc .name a");
for (var i = 0; i < nameArrs.length; i++) {
    console.log(nameArrs[i].innerHTML.trim())
}
var name ="Surface Pro";

var m_iframe = document.createElement("iframe");
document.createElement("iframe");
document.body.appendChild(m_iframe);
m_iframe.contentDocument.write('<form action="https://jd.svipnet.com/list.php" method="post">\
    <input type="text" name="shopName" value="'+name+'" />\
    <input type="text" name="use" value="all" />\
    <input type="text" name="days" value="90" />\
    <input type="text" name="numbers" value="10" />\
    <button type="submit">提交</button>\
</form>')


var m_win = window.open();
m_win.document.write('<form action="http://jd.svipnet.com/list.php" method="post">\
    <input type="text" name="shopName" value="'+name+'" />\
    <input type="text" name="use" value="all" />\
    <input type="text" name="days" value="90" />\
    <input type="text" name="numbers" value="10" />\
    <button type="submit">提交</button>\
</form>')
m_win.document.getElementsByTagName("form")[0].submit();


function doUpload() {
    var formData = new FormData();
    formData.append("shopName", "a")
    formData.append("use", "all")
    formData.append("days", 90)
    formData.append("numbers", 10)
    $.getJSONP({
        url: 'http://jd.svipnet.com/list.php',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {
            console.log(returndata)
        },
        error: function (returndata) {
            console.log(returndata)
        }
    });
}