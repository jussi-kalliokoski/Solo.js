"use strict";

var gulp = require("gulp");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var istanbul = require("gulp-istanbul");
var mocha = require("gulp-mocha");
var es3ify = require("gulp-es3ify");
var wrap = require("gulp-wrap-umd");
var rename = require("gulp-rename");
var runSequence = require("run-sequence");
var spawn = require("child_process").spawn;

var files = [
    "./index.js",
];

var configFiles = [
    "./gulpfile.js",
    "./karma.conf.js",
    "./test/**/*.js",
];

function handleError (error) {
    throw error;
}

gulp.task("jscs", function jscsTask () {
    return gulp.src(files.concat(configFiles))
        .pipe(jscs("./.jscs.json"))
        .on("error", handleError);
});

gulp.task("jshint", function jshintTask () {
    return gulp.src(files.concat(configFiles))
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"))
        .on("error", handleError);
});

gulp.task("build", function buildTask () {
    return gulp.src(files)
        .pipe(wrap({
            namespace: "Solo",
            exports: "Solo",
        }))
        .pipe(es3ify())
        .pipe(rename("solo.js"))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("build:specs", function buildSpecsTask () {
    gulp.src("./test/**/*Spec.js", { base: "./" })
        .pipe(es3ify())
        .pipe(gulp.dest("./.tmp/"));
});

gulp.task("build:tests", ["build:specs"], function buildTestsTask () {
    return gulp.src(files)
        .pipe(istanbul())
        .pipe(wrap({
            namespace: "Solo",
            exports: "Solo",
        }))
        .pipe(es3ify())
        .pipe(rename("solo.js"))
        .pipe(gulp.dest("./.tmp/"));
});

gulp.task("mocha", function (callback) {
    gulp.src(["test/*.js"])
        .pipe(mocha({
            reporter: "spec",
        }))
        .pipe(istanbul.writeReports())
        .on("end", callback);
});

gulp.task("karma", function karmaTask (callback) {
    var child = spawn("./node_modules/.bin/karma", ["start", "./karma.conf.js", "--single-run"], {
        stdio: "inherit",
    });

    child.on("close", function (exitCode) {
        if ( exitCode !== 0 ) {
            handleError(new Error("Tests failed"));
            return;
        }

        callback();
    });
});

gulp.task("test", function (callback) {
    runSequence(["jshint", "jscs"], "build:tests", "mocha", "karma", callback);
});
