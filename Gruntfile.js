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
        pkg: pkg,
        ver: '<%= pkg.version %>',
        destDir: 'espowered_tests',
        clean: {
            dist: ['<%= destDir %>/']
        },
        copy: {
            no_inst: {
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
        shell: {
            mkdir: {
                command: 'mkdir <%= destDir %>'
            }
        },
        espower: {
            powerAssertVariableName: 'assert',
            dest: '<%= destDir %>',
            dir: ['mocha_tests/*']
        },
        mochaTest: {
            espowered: {
                options: {
                    reporter: 'dot'
                },
                src: ['<%= destDir %>/**/*.js']
            }
        }
    });


    grunt.registerTask('espower', function() {
        var done = this.async();
        var espower = require('espower'),
            esprima = require('esprima'),
            escodegen = require('escodegen'),
            fs = require('fs'),
            path = require('path');

        grunt.config.get('espower.dir').forEach(function (pattern) {
            grunt.log.write('searching for ' + pattern + '...').ok();
            grunt.file.glob(pattern, function (err, files) {
                if (err) {
                    grunt.log.write('error ' + err.message).ok();
                    return;
                }
                files.forEach(function (file) {
                    grunt.log.write('espower ' + file + '...').ok();
                    var source = fs.readFileSync(file, 'utf-8'),
                        tree = esprima.parse(source, {tolerant: true, loc: true, range: true}),
                        options = {
                            powerAssertVariableName: grunt.config.get('espower.powerAssertVariableName'),
                            path: fs.realpathSync(file),
                            source: source
                        },
                        modified = espower(tree, options);
			        grunt.file.write(path.join(grunt.config.get('espower.dest'), path.basename(file)), escodegen.generate(modified));
                });
                done(files.length);
            });
        });
    });


    grunt.registerTask('default', ['clean:dist', 'shell:mkdir', 'copy:no_inst', 'espower', 'mochaTest:espowered']);
};
