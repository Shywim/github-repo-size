const gulp = require('gulp')
const zip = require('gulp-zip')
const del = require('del')

const paths = {
  build: {
    webext: 'build/webext',
    userscript: 'build/userscript'
  }
}

gulp.task('clean', function () {
  return del(['build'])
})

gulp.task('webext', function () {
  return gulp.src(['src/index.js', 'manifest.json', 'icon/*', 'LICENSE.md', 'README.md'])
    .pipe(zip('github-repo-size.zip'))
    .pipe(gulp.dest(paths.build.webext))
})
