var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var replace = require('replace');

var paths = {
    sass: ['./scss/**/*.scss'],
    css: ['./www/css/*.css']
};

gulp.task('default', ['sass', 'css']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('css', function(done) {
    gulp.src('./www/css/style.css')
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.css, ['css']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

var replaceFiles = ['./www/app/tatami.endpoint.js'];

gulp.task('dev', function() {
    return replace({
        regex: 'http://app.tatamisoft.com|http://10.1.10.202:8100',
        replacement: 'http://localhost:8100',
        paths: replaceFiles,
        recursive: false,
        silent: false
    });
});

gulp.task('device-dev', function() {
    return replace({
        regex: 'http://localhost:8100|http://app.tatamisoft.com',
        replacement: 'http://10.1.10.202:8100',
        paths: replaceFiles,
        recursive: false,
        silent: false
    });
});

gulp.task('prod', function() {
    return replace({
        regex: 'http://localhost:8100|http://10.1.10.202:8100',
        replacement: 'http://app.tatamisoft.com',
        paths: replaceFiles,
        recursive: false,
        silent: false
    });
});
