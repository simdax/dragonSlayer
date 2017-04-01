'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var rename = require('gulp-rename')
 
gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: '.'
		},
	})
});

gulp.task('sass', function () {
  return gulp.src('./dragon.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
    	extname: '.css'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({stream:true}));
});
 
gulp.task('watch', ['browser-sync'] ,function () {
  gulp.watch('./dragon.sass', ['sass']);
});

