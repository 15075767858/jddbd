var dest="/Applications/XAMPP/xamppfiles/htdocs/jingdongdbd"
var sources="/Volumes/XiaoMi-usb0/共享/jingdongdbd"

var gulp = require('gulp'),
    fileSync = require('gulp-file-sync');
gulp.task('file', function() {
  gulp.watch([dest+'/**/**'], function() {
    console.log(arguments)
    fileSync(dest,sources, {recursive: true,ignore: ["node_modules",".git"]});
  });
});
