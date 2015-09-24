'use strict';

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'bower_components/**/*.js',
            'src/main/webapp/**/*.js'
        ],
        exclude: [],

        preprocessors: {
            './src/**/*.js': 'coverage'
        },
        reporters: ['junit','progress','coverage','threshold'],

        junitReporter: {
            outputFile: 'test-reports/junit.xml',
            suite: 'ment.io'
        },

        thresholdReporter: {
            statements: 0,
            branches: 0,
            functions: 0,
            lines: 0
        },

        coverageReporter: {
              type: 'lcov',
              dir:'coverage/'
        },
        port: 8085,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 20000,
        singleRun: false,
        reportSlowerThan: 500

    });
};

