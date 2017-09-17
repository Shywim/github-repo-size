const gulp = require('gulp')
const zip = require('gulp-zip')
const concat = require('gulp-concat')
const del = require('del')
const merge = require('merge-stream')
const webExt = require('web-ext/dist/web-ext').main

const paths = {
  build: {
    webext: 'build/webext',
    webext_dist: 'build/webext-dist',
    userscript: 'build/userscript'
  }
}

gulp.task('clean', function () {
  return del(['build'])
})

gulp.task('webext-zip', function () {
  return gulp.src(paths.build.webext + '/**/*')
    .pipe(zip('github-repo-size.zip'))
    .pipe(gulp.dest(paths.build.webext_dist))
})

gulp.task('webext', function () {
  const script = gulp.src(['src/webext.js', 'src/index.js'])
    .pipe(concat('src/index.js'))

  const files = gulp.src(['manifest.json', 'icon/*', 'LICENSE.md', 'README.md', 'package.json', 'gulpfile.js'], {base: '.'})

  return merge(script, files)
    .pipe(gulp.dest(paths.build.webext))
})

gulp.task('userscript', function () {
  return gulp.src(['src/userscript.js', 'src/index.js'])
    .pipe(concat('github-repo-size.user.js'))
    .pipe(gulp.dest(paths.build.userscript))
})

gulp.task('build-all', ['webext', 'webext-zip', 'userscript'])

gulp.task('webext-run', ['webext'], function () {
  gulp.watch('src/**/*', ['webext'])
  //webExt(paths.build.webext, {argv: 'run', runOptions: {shouldExitProgram: false, noInput: true}})
})
