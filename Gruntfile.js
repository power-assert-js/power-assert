module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    (function () {
        var taskName;
        for(taskName in pkg.devDependencies) {
            if(taskName.substring(0, 6) === 'grunt-') {
                grunt.loadNpmTasks(taskName);
            }
        }
    })();

    grunt.initConfig({
        destDir: 'espowered_tests',
        clean: {
            functional_test: ['<%= destDir %>/']
        },
        copy: {
            functional_test: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'not_instrumented_tests/',      // Src matches are relative to this path.
                        src: ['**/*.js'], // Actual pattern(s) to match.
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
                        cwd: 'mocha_tests/',      // Src matches are relative to this path.
                        src: ['**/*.js'], // Actual pattern(s) to match.
                        dest: '<%= destDir %>/',   // Destination path prefix.
                        ext: '.js'   // Dest filepaths will have this extension.
                    },
                ]
            }
        },
        mochaTest: {
            functional_test: {
                options: {
                    reporter: 'dot'
                },
                src: ['<%= destDir %>/**/*.js']
            }
        }
    });


    grunt.registerTask('test', ['clean', 'copy', 'espower', 'mochaTest']);
};
