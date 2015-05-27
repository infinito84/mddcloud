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
  browserify('./frontend/js/mddcloud.js')
      .transform(hbsfy)
      .ignore('jquery.mousewheel')
      .ignore('jquery.select2')
      .bundle()
      .pipe(source('mddcloud.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('frontend/public/js'));
});

gulp.task('i18n', function () {
  gulp.src('frontend/js/locales/**')
    .pipe(jsonminify())
    .pipe(gulp.dest('frontend/public/js/locales'));
});

gulp.task('stylus', function () {
  gulp.src('frontend/css/mddcloud.styl')
    .pipe(stylus({
      'include css': true,
      use: nib(),
      compress : true
    }))
    .pipe(gulp.dest('frontend/public/css'));
});

gulp.task('images', function () {
  gulp.src('frontend/img/**')
    .pipe(changed("frontend/public/img"))
    .pipe(imagemin())
    .pipe(gulp.dest("frontend/public/img"));
  gulp.src(['frontend/css/*.gif','frontend/css/*.png'])
    .pipe(changed("frontend/public/css"))
    .pipe(imagemin())
    .pipe(gulp.dest("frontend/public/css"));
});

gulp.task('fonts', function () {
  gulp.src('frontend/fonts/**')
    .pipe(gulp.dest('frontend/public/fonts'));
  gulp.src('frontend/js/libs/font-awesome-stylus/fonts/**')
    .pipe(gulp.dest('frontend/public/fonts'));
});

gulp.task('default', [ 'js','i18n','stylus','images','fonts']);