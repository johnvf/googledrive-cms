var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    less = require('gulp-less'),
    source = require('vinyl-source-stream'),
    gls = require('gulp-live-server'),
    port = process.env.port || 3000;

var server = gls.new('server.js');

gulp.task('serve',  function() {
  server.start();
});


gulp.task('watch', function(){
  gulp.watch(['src/**/*.*'], ['build' , server.notify]);
  gulp.watch('bower_components/**/*.*', ['build' , server.notify]);
  gulp.watch('./server.js', server.start);
})

gulp.task('less', function() {
    gulp.src('./src/less/styles.less')
        .pipe(less({}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('browserify', function() {
    browserify('./src/js/App.js')
    .transform('reactify', { 'es6': true , 'global': true })
    .bundle()
    .pipe(source('App.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy', function() {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'));
  gulp.src('./src/lib/**/*.*')
    .pipe(gulp.dest('./dist/js'));
  gulp.src('./src/img/**/*.*')
    .pipe(gulp.dest('./dist/img'));
  gulp.src('./src/fonts/**/*.*')
    .pipe(gulp.dest('./dist/fonts'));    
  gulp.src('./bower_components/bootstrap/fonts/**/*.*')
    .pipe(gulp.dest('./dist/fonts'));
  gulp.src('./bower_components/bootstrap/dist/js/*')
    .pipe(gulp.dest('./dist/js'));
  gulp.src('./bower_components/jquery/dist/*')
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('build',['browserify','less', 'copy']);
gulp.task('dev',['browserify','less', 'copy', 'serve', 'watch']);
gulp.task('default',['dev']);