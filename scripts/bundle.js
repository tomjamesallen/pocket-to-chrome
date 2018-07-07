const gulp = require('gulp');

gulp.task('default', () => {
  gulp
    .src(['../background.js', '../manifest.json'])
    .pipe(gulp.dest('../bundle'));
});
