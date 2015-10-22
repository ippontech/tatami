'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var gjshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var stylish = require('jshint-stylish');

var port = gutil.env.port || 3000;
var covport = gutil.env.covport || 3001;
var lrport = gutil.env.lrport || 35729;
var openBrowser = gutil.env.browser;
var bump = require('gulp-bump');

/*
 * Default task is to start the site
 */
gulp.task('default', ['site']);

gulp.task('site', ['copy', 'dist'], function () {
    var express = require('express');
    var app = express();

    app.use(require('connect-livereload')({
        port: lrport
    }));

    app.use(express.static('./'));

    app.listen(port, function () {
        var lrServer = require('gulp-livereload')();

        gulp.watch(['srcgulp.task('test', ['copy', 'dist'], function () {
    testTask({
        isWatch: gutil.env.hasOwnProperty('watch')
    });
});

gulp.task('coveralls', function () {
    var coveralls = require('gulp-coveralls');

    gulp.src('./coverage/**/lcov.info')
      .pipe(coveralls());
});

gulp.task('coverage', function () {
    var express = require('express');
    var app = express();
    var coverageFile;
    var karmaHtmlFile;

    function getTestFile (path) {
        if (fs.existsSync(path)) {
            var files = fs.readdirSync(path);

            if (files) {
                for (var i = 0; i < files.length; i++) {
                    if (fs.lstatSync(path + '/' + files[i]).isDirectory()) {
                        return files[i];
                    } else {
                        return files[i];
                    }
                }
            }
        }
    }

    testTask({
        isWatch: gutil.env.hasOwnProperty('watch'),
        reporters: ['progress', 'coverage', 'threshold']
    });

    setTimeout(function () {
        coverageFile = getTestFile('coverage');
        karmaHtmlFile = getTestFile('karma_html');

        app.use(express.static('./'));

        app.listen(covport, function openPage () {
            if (coverageFile) {
                require('open')('http://localhost:' + covport + '/coverage/' + coverageFile);
            }
        });
    }, 3000);
});