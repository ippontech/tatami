/**
 * @file
 *
 * ### Responsibilities
 * - automate common tasks using grunt
 *
 * Scaffolded with generator-microjs v0.1.2
 *
 * @author  <>
 */
'use strict';

module.exports = function (grunt) {
    var config = {
        app: 'app',
        dist: 'dist'
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        config: config,

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/**/*.js',
                'test/spec/**/*.js'
            ]
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        concat: {
            angular: {
                src: ['<%= config.app %>/angular-bootstrap-tour.js', '<%= config.app %>/**/*.js'],
                dest: '<%= config.dist %>/angular-bootstrap-tour.js'
            }
        },

        uglify: {
            angular: {
                src: '<%= config.dist %>/angular-bootstrap-tour.js',
                dest: '<%= config.dist %>/angular-bootstrap-tour.min.js'
            }
        },

        copy: {
            demo: {
                files: [
                    {
                        src: 'dist/angular-bootstrap-tour.js',
                        dest: 'demo/angular-bootstrap-tour.js'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            test: {
                src: 'karma.conf.js',
                devDependencies: true,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            },

            demo: {
                src: 'demo/index.html',
                devDependencies: true,
                ignorePath: '../',
                exclude: [
                    'bootstrap.css',
                    'bootstrap-tour-standalone.js',
                    'bootstrap-tour-standalone.css',
                    'respond.src.js'
                ]
            }
        },


        bower_main: {
            demo: {
                options: {
                    dest: 'demo/bower_components'
                }
            }
        }
    });

    grunt.registerTask('test', [
        'karma:unit'
    ]);

    grunt.registerTask('build', [
        'concat',
        'uglify'
    ]);

    grunt.registerTask('demo', [
        'build',
        'bower_main:demo',
        'wiredep:demo',
        'copy:demo'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
