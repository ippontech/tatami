
module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/bootstrap-tour/build/js/bootstrap-tour.js',
            'bower_components/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
            'app/angular-bootstrap-tour.js',
            'app/**/*.js',
            'test/spec/**/*.js'
        ],
        exclude: [],
        preprocessors: {
            'src/**/*.js': ['coverage']
        },
        reporters: ['dots', 'junit', 'coverage', 'growl'],

        htmlReporter: {
            outputDir: 'test/results',
            templatePath: 'node_modules/karma-html-reporter/jasmine_template.html'
        },

        junitReporter: {
            outputFile: 'test/results/karma.xml'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
