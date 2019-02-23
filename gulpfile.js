const path = require('path')
const {
  series,
  parallel,
  watch,
  src,
  dest
} = require('gulp')
const zip = require('gulp-zip')
const concat = require('gulp-concat')
const del = require('del')
const merge = require('merge-stream')
const webExt = require('web-ext').default;

const paths = {
  build: {
    webext: path.resolve(__dirname, './build/webext'),
    webext_dist: path.resolve(__dirname, './build/webext-dist'),
    userscript: path.resolve(__dirname, './build/userscript')
  }
}

function clean() {
  return del(['build'])
}

function webextZip() {
  return src(paths.build.webext + '/**/*')
    .pipe(zip('github-repo-size.zip'))
    .pipe(dest(paths.build.webext_dist))
}

function webext() {
  const script = src(['src/webext.js', 'src/index.js'])
    .pipe(concat('src/index.js'))

  const files = src(['manifest.json', 'icon/*', 'LICENSE.md', 'README.md', 'package.json', 'gulpfile.js'], {
    base: '.'
  })

  return merge(script, files)
    .pipe(dest(paths.build.webext))
}

function userscript() {
  return src(['src/userscript.js', 'src/index.js'])
    .pipe(concat('github-repo-size.user.js'))
    .pipe(dest(paths.build.userscript))
}

const buildAll = series([webext, webextZip, userscript])

function webextRun() {
  webExt.cmd.run({
    sourceDir: paths.build.webext
  }, {
    shouldExitProgram: false,
    noInput: true
  })
}

function webextWatch() {
  watch('src/**/*', webext)
}

exports.clean = clean
exports.buildAll = buildAll
exports.webextZip = webextZip
exports.webext = webext
exports.userscript = userscript
exports.webextWatch = series(webext, parallel(webextWatch, webextRun))