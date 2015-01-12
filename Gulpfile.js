var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    changed     = require('gulp-changed')
    imagemin    = require('gulp-imagemin'),
    stripDebug  = require('gulp-strip-debug'),
    minifyCSS   = require('gulp-minify-css'),
    minifyHTML  = require('gulp-minify-html'),
    stylus      = require('gulp-stylus'),
    jsonminify  = require('gulp-jsonminify'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    streamify   = require('gulp-streamify'),
    nib         = require('nib'),
    hbsfy       = require("hbsfy");

gulp.task('js', function () {
  hbsfy.configure({
      extensions: ['hbs']
  });
  browserify('./js/mddcloud.js')
      .transform(hbsfy)
      .bundle()
      .pipe(source('mddcloud.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('public/js'));
});

gulp.task('i18n', function () {
  gulp.src('locales/**')
    .pipe(jsonminify())
    .pipe(gulp.dest('public/locales'));
});

gulp.task('stylus', function () {
  gulp.src('css/mddcloud.styl')
    .pipe(stylus({
      compress: true,
      use: nib()
    }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('images', function () {
  gulp.src('img/**')
    .pipe(changed("public/img"))
    .pipe(imagemin())
    .pipe(gulp.dest("public/img"));
});

gulp.task('html', function () {
  var htmlSrc = '*.html',
      htmlDst = 'public';

  gulp.src(htmlSrc)
  .pipe(minifyHTML())
  .pipe(gulp.dest(htmlDst));
});

gulp.task('fonts', function () {
  gulp.src('fonts/**')
    .pipe(gulp.dest('./public/fonts'));
  gulp.src('bower_components/font-awesome-stylus/fonts/**')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('data', function () {
   gulp.src('app/data.json')
    .pipe(gulp.dest('./public'));
});

gulp.task('default', [ 'js','html','i18n','stylus','images','fonts']);