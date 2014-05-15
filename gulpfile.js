var gulp = require('gulp'),
    bump = require('gulp-bump'),
    mocha = require('gulp-spawn-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    espower = require('gulp-espower'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    merge = require('lodash.merge'),
    bundleDir = 'build',
    bundleName = 'power-assert.js',
    destDir = 'espowered_tests';

function runMocha(pattern, extraOptions) {
    extraOptions = extraOptions || {};
    return gulp
        .src(pattern, {read: false})
        .pipe(mocha(merge({
            R: 'dot',
            c: true
        }, extraOptions)))
        .on('error', console.warn.bind(console));
}

function runMochaWithEspowerLoader() {
    return runMocha('test/**/*_test.js', {r: './enable_power_assert'});
}

function bumpVersion(options) {
    return gulp
        .src(['./bower.json', './package.json'])
        .pipe(bump(options))
        .pipe(gulp.dest('./'));
}

['patch', 'minor', 'major'].forEach(function (v) {
    gulp.task('bump_' + v, function(){
        return bumpVersion({type: v});
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
        .src(bundleDir, {read: false})
        .pipe(clean());
});

gulp.task('bundle', function() {
    var bundleStream = browserify('./lib/power-assert.js').bundle({standalone: 'assert'});
    return bundleStream
        .pipe(source(bundleName))
        .pipe(gulp.dest(bundleDir));
})

gulp.task('clean', function () {
    return gulp
        .src(destDir, {read: false})
        .pipe(clean());
});

gulp.task('copy_not_tobe_instrumented', function(){
    return gulp
        .src('test/not_tobe_instrumented/**/*.js', {base: './test/'})
        .pipe(gulp.dest(destDir));
});

gulp.task('espower', function() {
    return gulp
        .src('test/tobe_instrumented/**/*.js', {base: './test/'})
        .pipe(espower())
        .pipe(gulp.dest(destDir));
});

gulp.task('unit', function () {
    return runMochaWithEspowerLoader();
});

gulp.task('functional', function () {
    return runMocha(destDir + '/**/*_test.js');
});

gulp.task('browser', function () {
    return gulp
        .src('test/test-browser.html')
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('amd', function () {
    return gulp
        .src('test/test-amd.html')
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('test_bundle', function () {
    return gulp
        .src('test/test-bundle.html')
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('test', function(callback) {
    runSequence(
        ['clean', 'clean_bundle'],
        ['copy_not_tobe_instrumented', 'espower', 'bundle'],
        ['unit','functional','browser','amd', 'test_bundle']
    );
});
