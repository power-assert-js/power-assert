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
        unit: {
            dir: ['test/**/*.js']
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


    grunt.registerTask('qunit-test', function() {
        var done = this.async(),
            QUnit = require("qunitjs");

        var tap = (function (qu) {
            var qunitTap = require("qunit-tap"),
                util = require('util');
            return qunitTap(qu, util.puts, {showSourceOnFailure: false});
        })(QUnit);
        
        function removeCallback (ary, element) {
            var index = ary.indexOf(element);
            if (index !== -1) {
                ary.splice(index, 1);
            }
        }

        var gruntQunitTaskDone = function gruntQunitTaskDone ( details ) {
            var succeeded = (details.failed === 0),
                message = details.total + " assertions in (" +
                    details.runtime + "ms), passed: " +
                    details.passed + ", failed: " + details.failed;
            if ( succeeded ) {
                grunt.log.ok(message);
            } else {
                grunt.log.error(message);
            }
            tap.unsubscribe();
            removeCallback(QUnit.config.done, gruntQunitTaskDone);
            done( succeeded );
        };
        QUnit.done(gruntQunitTaskDone);
        QUnit.config.autorun = false;
        QUnit.config.autostart = false;
        QUnit.config.updateRate = 0;
        if (QUnit.config.semaphore === 1) {
            QUnit.config.semaphore = 0;
        }
        QUnit.load();

        grunt.config.get('unit.dir').forEach(function (pattern) {
            grunt.log.ok('searching for ' + pattern + '...');
            grunt.file.glob(pattern, function (err, files) {
                if (err) {
                    grunt.log.error('error ' + err.message);
                    return;
                }
                files.forEach(function (file) {
                    grunt.log.write('require ' + file + '...').ok();
                    require('./' + file);
                });
            });
        });
    });


    grunt.registerTask('espower', function() {
        var done = this.async();
        var espower = require('./lib/espower'),
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


    grunt.registerTask('default', ['clean:dist', 'shell:mkdir', 'qunit-test', 'copy:no_inst', 'espower', 'mochaTest:espowered']);

    grunt.registerTask('unit', ['qunit-test']);

    grunt.registerTask('functional', ['clean:dist', 'shell:mkdir', 'copy:no_inst', 'espower', 'mochaTest:espowered']);
};
