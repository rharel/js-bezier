/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

module.exports = function(grunt) {

  config = {
    pkg: grunt.file.readJSON('package.json'),
    src_dir: 'src/',
    test_dir: 'test/',
    dist_dir: 'dist/',
    demo_dir: 'demo/',
    source_files: [ '<%= src_dir %>**/*.js' ],
    test_files: '<%= test_dir %>**/*.test.js',

    jshint: {
      all: [
        '<%= src_dir %>**/*.js',
        '<%= demo_dir %>/js/*.js'
      ]
    },

    clean: {
      release: {
        src: [
          '<%= dist_dir %>**/*.js'
        ]
      }
    },

    mochacli: {
      options: {
        require: ['chai'],
        reporter: 'spec',
        bail: true
      },
      all: '<%= test_dir %>/*.test.js'
    },

    copy: {
      release: {
        src: '<%= src_dir %>/bezier.js',
        dest: '<%= dist_dir %>/bezier.js'
      }
    },

    uglify: {
      release: {
        files: {
          '<%= dist_dir %>/bezier.min.js': ['<%= src_dir %>/bezier.js']
        }
      }
    }
  };

  grunt.registerTask('build', [
    'clean:release',
    'uglify:release',
    'copy:release'
  ]);
  grunt.registerTask('test', ['mochacli:all']);
  grunt.registerTask('dev', [
    'jshint:all',
    'test'
  ]);
  grunt.registerTask('release', [
    'jshint:all',
    'test',
    'clean:release',
    'uglify:release',
    'copy:release'
  ]);
  grunt.registerTask('default', 'dev');

  require('load-grunt-tasks')(grunt);

  return grunt.initConfig(config);
};