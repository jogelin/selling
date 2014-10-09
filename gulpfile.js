'use strict';

// Include Gulp
var gulp = require('gulp');

var concat = require("gulp-concat");
var filter = require("gulp-filter");
var jshint = require("gulp-jshint");
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');

var bases = {
    app: 'app/',
    dist: 'build/'
};

var paths = {
    scripts: ['lib/*.js'],
    styles: ['sass/*.sass'],
    fonts: ['webfontkit/*.eot', 'webfontkit/*.svg', 'webfontkit/*.ttf', 'webfontkit/*.woff', 'webfontkit/*.woff2'],
    html: ['**/*.html'],
    images: ['images/**/*.png'],
    datas: ['data/**/*.*'],
    extras: ['.htaccess', 'robots.txt', 'favicon.ico'],
};

// APP
gulp.task('build-copy', function() {
    // Copy html
    gulp.src(paths.html, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));

    // Copy fonts
    gulp.src(paths.fonts, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist + 'webfontkit/'));

     // Copy images
    gulp.src(paths.images, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist + 'images/'));

    // Copy extras
    gulp.src(paths.extras, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));

    // Copy datas
    gulp.src(paths.datas, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist + 'data'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('build-js', function() {
    return gulp.src(paths.scripts, {cwd: bases.app})
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(bases.dist + 'js/'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('build-sass', function() {
    return gulp.src(paths.styles, {cwd: bases.app})
        .pipe(sass())
        .pipe(minifyCSS({keepBreaks:true,keepSpecialComments: 0}))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(bases.dist + 'css/'))
        .pipe(browserSync.reload({stream:true}));
});

// BOWER
gulp.task('build-bower-dependencies', function() {
 	gulp.src(mainBowerFiles())
		.pipe(filter('*.js'))
		.pipe(uglify())
		.pipe(concat('bower.min.js'))
		.pipe(gulp.dest(bases.dist + 'js/'));

 	gulp.src(mainBowerFiles())
		.pipe(filter('*.css'))
		.pipe(minifyCSS({keepBreaks:true}))
		.pipe(concat('bower.min.css'))
		.pipe(gulp.dest(bases.dist + 'css/'))
		.pipe(browserSync.reload({stream:true}));
 });

// MAIN
gulp.task('watch', function() {
    gulp.watch(bases.app + paths.scripts, ['build-js']);
    gulp.watch(bases.app + paths.styles, ['build-sass']);
    gulp.watch(bases.app + paths.html, ['build-copy']);
    gulp.watch(bases.app + paths.datas, ['build-copy']);
    gulp.watch(bases.app + paths.fonts, ['build-copy']);
    gulp.watch(bases.app + paths.images, ['build-copy']);
    gulp.watch(bases.app + paths.extras, ['build-copy']);
    gulp.watch(mainBowerFiles(), ['build-bower-dependencies']);

});

gulp.task('build', ['build-js','build-sass','build-copy','build-copy','build-copy','build-copy','build-copy','build-bower-dependencies']);

/*SERVER*/
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: bases.dist
        }
    });

    gulp.watch(['./**/*.*'], {cwd: bases.dist}, browserSync.reload);
});
