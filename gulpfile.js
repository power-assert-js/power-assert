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
    bumpTarget = ['./bower.json', './package.json'],
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
        .on('error', gutil.log);
}

function runMochaWithEspowerLoader() {
    return runMocha('test/**/*_test.js', {r: './enable_power_assert'});
}

function bumpVersion(options) {
    return gulp
        .src(bumpTarget)
        .pipe(bump(options))
        .pipe(gulp.dest('./'));
}

gulp.task('git_add', function(){
    return gulp
        .src(bumpTarget)
        .pipe(git.add());
});

gulp.task('git_commit', function(){
    var pkg = require('./package.json');
    return gulp
        .src(bumpTarget)
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
        .src(bundleDir, {read: false})
        .pipe(clean());
});

gulp.task('bundle', function() {
    var bundleStream = browserify('./lib/power-assert.js').bundle({standalone: 'assert'});
    return bundleStream
        .pipe(source(bundleName))
        .pipe(gulp.dest(bundleDir));
})

gulp.task('clean_espower', function () {
    return gulp
        .src(destDir, {read: false})
        .pipe(clean());
});

gulp.task('copy_others', function(){
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

gulp.task('test_espowered', function () {
    return runMocha(destDir + '/**/*_test.js');
});

gulp.task('test_amd', function () {
    return gulp
        .src('test/test-amd.html')
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('test_browser', function () {
    return gulp
        .src('test/test-browser.html')
        .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('test', function() {
    runSequence(
        ['clean_espower', 'clean_bundle'],
        ['espower', 'copy_others', 'bundle'],
        ['unit','test_espowered','test_browser','test_amd']
    );
});
