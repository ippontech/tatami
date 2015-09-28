module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*.js']
    },
    concat: {
      dist: {
          src: [
              'http://s1.daumcdn.net/svc/original/U0301/cssjs/ejohn/class-0.1.0.js',
              'grunt.js'
          ],
          dest: 'dist/test.js',
          separator: '/*****************************/\n'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'concat');

};
