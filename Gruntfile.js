module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    require('jit-grunt')(grunt, {
        bower: 'grunt-bower-requirejs'
    });

    grunt.initConfig({
        pkg: pkg,
        bower: {
            all: {
                rjsConfig: 'test/rjsconfig.js',
                options: {
                    baseUrl: 'test'
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: '%VERSION%',
                commitFiles: ['package.json', 'bower.json'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: '%VERSION%',
                push: false,
                pushTo: 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '.',
                    keepalive: true
                }
            }
        },
        destDir: 'espowered_tests',
        clean: {
            functional_test: ['<%= destDir %>/']
        },
        copy: {
            functional_test: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'test/',      // Src matches are relative to this path.
                        src: ['not_tobe_instrumented/**/*.js'], // Actual pattern(s) to match.
                        dest: '<%= destDir %>/',   // Destination path prefix.
                        ext: '.js'   // Dest filepaths will have this extension.
                    },
                ]
            }
        },
        espower: {
            functional_test: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'test/',      // Src matches are relative to this path.
                        src: ['tobe_instrumented/**/*.js'], // Actual pattern(s) to match.
                        dest: '<%= destDir %>/',   // Destination path prefix.
                        ext: '.js'   // Dest filepaths will have this extension.
                    },
                ]
            }
        },
        mocha: {
            browser: {
                src: ['test/test-browser.html'],
                options: {
                    run: true
                }
            },
            amd: {
                src: ['test/test-amd.html'],
                options: {
                    run: false
                }
            }
        },
        mochaTest: {
            espower_loader: {
                options: {
                    reporter: 'dot',
                    require: './enable_power_assert'
                },
                src: ['test/**/*_test.js']
            },
            grunt_espower: {
                options: {
                    reporter: 'dot'
                },
                src: ['<%= destDir %>/**/*.js']
            }
        }
    });


    grunt.registerTask('unit', ['mochaTest:espower_loader']);
    grunt.registerTask('code_generation_based', ['clean', 'copy', 'espower', 'mocha:browser', 'mocha:amd', 'mochaTest:grunt_espower']);
    grunt.registerTask('test', ['unit', 'code_generation_based']);
};
