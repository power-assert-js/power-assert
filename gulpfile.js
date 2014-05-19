var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bump = require('gulp-bump'),
    git = require('gulp-git'),
    mocha = require('gulp-spawn-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    espower = require('gulp-espower'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    merge = require('lodash.merge'),
    paths = {
        bump: {
            target: ['./bower.json', './package.json']
        },
        bundle: {
            srcFile: './lib/power-assert.js',
            destDir: './build',
            destName: 'power-assert.js'
        },
        test: {
            base: './test/',
            pattern: '**/*_test.js',
            poweredDir: './espowered_tests/',
            toBeInstrumented: function () {
                return this.base + 'tobe_instrumented/' + this.pattern;
            },
            notToBeInstrumented: function () {
                return this.base + 'not_tobe_instrumented/' + this.pattern;
            },
            amd: 'test/test-amd.html',
            browser: 'test/test-browser.html'
        }
    };

function runMocha(pattern, extraOptions) {
    extraOptions = extraOptions || {};
    return gulp
        .src(pattern, {read: false})
        .pipe(mocha(merge({
            bin: './node_modules/.bin/mocha',
            R: 'dot',
            c: true
        }, extraOptions)))
        .on('error', gutil.log);
}

function runMochaWithEspowerLoader() {
    return runMocha(paths.test.base + paths.test.pattern, {r: './enable_power_assert'});
}

function bumpVersion(options) {
    return gulp
        .src(paths.bump.target)
        .pipe(bump(options))
        .pipe(gulp.dest('./'));
}

gulp.task('git_add', function(){
    return gulp
        .src(paths.bump.target)
        .pipe(git.add());
});

gulp.task('git_commit', function(){
    var pkg = require('./package.json');
    return gulp
        .src(paths.bump.target)
        .pipe(git.commit(pkg.version));
});

gulp.task('git_tag', function(done) {
    var pkg = require('./package.json');
    git.tag('v' + pkg.version, pkg.version, null, done);
});

['patch', 'minor', 'major'].forEach(function (v) {
    gulp.task('bump_' + v, function(){
        return bumpVersion({type: v});
    });
    gulp.task('release_' + v, function(){
        runSequence(
            'bump_' + v,
            'git_add',
            'git_commit',
            'git_tag'
        );
    });
});

gulp.task('connect', function() {
    connect.server({
        root: [__dirname],
        port: 9001,
        keepalive: true
    });
});

gulp.task('watch', function () {
    gulp.watch('{lib,test}/**/*.js', runMochaWithEspowerLoader);
    runMochaWithEspowerLoader();
});

gulp.task('clean_bundle', function () {
    return gulp
        .src(paths.bundle.destDir, {read: false})
        .pipe(clean());
});

gulp.task('bundle', function() {
    var bundleStream = browserify(paths.bundle.srcFile).bundle({standalone: 'assert'});
    return bundleStream
        .pipe(source(paths.bundle.destName))
        .pipe(gulp.dest(paths.bundle.destDir));
})

gulp.task('clean_espower', function () {
    return gulp
        .src(paths.test.poweredDir, {read: false})
        .pipe(clean());
});

gulp.task('copy_others', function(){
    return gulp
        .src(paths.test.notToBeInstrumented(), {base: paths.test.base})
        .pipe(gulp.dest(paths.test.poweredDir));
});

gulp.task('espower', function() {
    return gulp
        .src(paths.test.toBeInstrumented(), {base: paths.test.base})
        .pipe(espower())
        .pipe(gulp.dest(paths.test.poweredDir));
});

gulp.task('unit', function () {
    return runMochaWithEspowerLoader();
});

gulp.task('test_espowered', function () {
    return runMocha(paths.test.poweredDir + paths.test.pattern);
});

gulp.task('test_amd', function () {
    return gulp
        .src(paths.test.amd)
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('test_browser', function () {
    return gulp
        .src(paths.test.browser)
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('test', function() {
    runSequence(
        ['clean_espower', 'clean_bundle'],
        ['espower', 'copy_others', 'bundle'],
        ['unit','test_espowered','test_browser','test_amd']
    );
});
