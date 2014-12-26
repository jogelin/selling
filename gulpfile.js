'use strict';

// Include Gulp
var gulp = require('gulp');

var concat = require("gulp-concat");
var filter = require("gulp-filter");
var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');

var browserSync = require('browser-sync');


var bases = {
    app: 'app/',
    bower: 'bower_components/'
};

gulp.task('build', function() {
     gulp.src("**/*.sass", {cwd: bases.app})
        .pipe(sass())
        .pipe(minifyCSS({keepBreaks:true,keepSpecialComments: 0}))
        .pipe(gulp.dest(bases.app));


    gulp.src("**/*.*", {cwd: bases.bower})
        .pipe(gulp.dest(bases.app+'components'));
});

// MAIN
gulp.task('watch', function() {

    gulp.watch(bases.app + "**/*.sass", ['build']);

});

/*SERVER*/
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: bases.app
        }
    });

   gulp.watch(['**/*.*'], {cwd: bases.app}, browserSync.reload);
});
