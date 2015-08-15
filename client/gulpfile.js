var gulp      = require('gulp');
var gutil     = require('gulp-util');
var connect   = require('gulp-connect');
var gulpif    = require('gulp-if');
var concat    = require('gulp-concat');
var tplCache  = require('gulp-angular-templatecache');
var jade      = require('gulp-jade');
var less      = require('gulp-less');
var cssmin    = require('gulp-cssmin');
var uglify    = require('gulp-uglify');
var imagemin  = require('gulp-imagemin');
var pngquant  = require('imagemin-pngquant');


gulp.task('appJS', function() {
  gulp.src(['!./app/**/*_test.js', './app/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../server/public/js'))
});

gulp.task('templates', function() {
  gulp.src(['!./app/index.jade', './app/**/*.jade'])
      .pipe(gulpif(/[.]jade$/, jade().on('error', gutil.log)))
      .pipe(tplCache('templates.js',{standalone:true}))
      .pipe(gulp.dest('../server/public/js'))
});

gulp.task('appCSS', function() {
  gulp.src(['./app/**/*.less'])
    .pipe(less({
      paths: ['./app/stylesheets/lib']
    }))
    .pipe(concat('app.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('../server/public/css'))
});

gulp.task('libJS', function() {
  gulp.src([
    './bower_components/lodash/lodash.min.js',
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/angular/angular.min.js',
    './bower_components/angular-route/angular-route.min.js',
    './bower_components/angular-bcrypt/dist/dtrw.bcrypt.js',
    './bower_components/angular-sanitize/angular-sanitize.min.js',
    './bower_components/angular-resource/angular-resource.min.js',
    './bower_components/angular-md5/angular-md5.min.js',
    './bower_components/angular-mocks/angular-mocks.js',
    ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('../server/public/js'))
});

gulp.task('libCSS',
  function() {
  gulp.src(['!./bower_components/**/*.min.css',
    './bower_components/**/*.css'])
    .pipe(concat('lib.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('../server/public/css'))
});

gulp.task('imagemin', function () {
  gulp.src('./app/images/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('../server/public/images'))
});

gulp.task('index', function() {
  gulp.src(['./app/index.jade'])
    .pipe(gulpif(/[.]jade$/, jade().on('error', gutil.log)))
    .pipe(gulp.dest('../server/public'))
});

gulp.task('watch',function() {
  gulp.watch(['!./app/**/*_test.js', './app/**/*.js'], ['appJS']);
  gulp.watch(['!./app/index.jade', './app/**/*.jade'], ['templates']);
  gulp.watch(['./app/**/*.less'],                      ['appCSS']);
  gulp.watch(['./app/index.jade'],                     ['index']);
});

gulp.task('connect', connect.server({
  port: 9000,
}));

gulp.task('default', 
  [
    'connect', 
    'appJS', 'libJS',
    'appCSS', 'libCSS', 
    'index', 'templates', 
    'watch'
  ]
);