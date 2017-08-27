const gulp = require('gulp')
const zip = require('gulp-zip')
const concat = require('gulp-concat')
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

gulp.task('userscript', function () {
  return gulp.src(['src/userscript.js', 'src/index.js'])
    .pipe(concat('github-repo-size.user.js'))
    .pipe(gulp.dest(paths.build.userscript))
})

gulp.task('build-all', ['webext', 'userscript'])
