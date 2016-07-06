var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  jshint = require('gulp-jshint'),
  watch = require('gulp-watch'),
  paths = {
    lib: './lib/*.js',
    tests: './test/**.js'
  };

gulp.task('watch', function () {
  gulp.watch(paths.lib, ['default']);
  gulp.watch(paths.tests, ['tests']);
});

gulp.task('test', function(){
  return gulp.src(paths.tests, {read: false})
             .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint', function() {
  return gulp.src(paths.lib)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['lint', 'test']);
