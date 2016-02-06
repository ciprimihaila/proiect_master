"use strict";

module.exports = function(grunt) {
    
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        all:
            {
                files: [
                        {
                            expand: true,
                            cwd: 'lib/',
                            src: ['*.js'],
                            dest: 'build/lib',
                        },
                        {
                            expand: true,
                            cwd: 'services/',
                            src: ['*.js'],
                            dest: 'build/services',
                        },
                        {
                            src: 'index.js',
                            dest: 'build/index.js'
                        }
                    ]
            }
        },
        clean:
        {
          all: ['build/', 'docs/']
        },
        jshint:
        {
            options:
            {
                node:true,
                mocha: true
            },
            
            all: ['services/', 'lib/', 'index.js']
        },
        jsdoc : {
            dist : {
                src: ['services/', 'index.js', 'lib/', 'angular-seed/app/*'],
                options: {
                    destination: '../doc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['jshint', 'clean', 'uglify']);
};
