/*
 * grunt-strip-comments
 * https://github.com/kkemple/grunt-strip-comments
 *
 * Copyright (c) 2013 Kurtis Kemple
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('comments', 'Remove comments from production code', function() {

    var multilineComment = /\/\*\*[^!][\s\S]*?\*\/\n/gm;
    var singleLineComment = /^\s*\t*(\/\/)[^\n\r]*[\n\r]/gm;

    var options = this.options({
      singleline: true,
      multiline: true
    });

    this.files[0].src.forEach(function (file) {

      var contents = grunt.file.read(file);

      if ( options.multiline ) {
         contents = contents.replace(multilineComment, '');
      }

      if ( options.singleline ) {
         contents = contents.replace(singleLineComment, '');
      }

      grunt.file.write(file, contents);
    });
  });
};
