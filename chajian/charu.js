/**
 * Created by liuzhencai on 2016/11/22.
 */
console.log("插件开始运行")
setTimeout(function () {
  
    //var token = QZONE.FP.getACSRFToken()
    //console.log(token)
}, 0)

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

//injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'body');
injectScript(chrome.extension.getURL('/qiang.js'), 'body');
