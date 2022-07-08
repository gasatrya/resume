'use strict'

// Sets up variables
const { series, watch, src, dest, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')
const pug = require('gulp-pug')
const prettier = require('gulp-prettier')
const browserSync = require('browser-sync').create()
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')

// Browser Sync
function serve(done) {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    port: 3000,
    open: false,
  })
  done()
}

// Sass compiler
function css() {
  return src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError)
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

// HTML compiler
function html() {
  return src('src/pug/**/!(_)*.pug').pipe(pug()).pipe(dest('dist')).pipe(browserSync.stream())
}

// Build CSS
function buildCSS() {
  return src('dist/css/**/*.css')
    .pipe(postcss([autoprefixer()]))
    .pipe(prettier())
    .pipe(dest('dist/css'))
}

// Build HTML
function buildHTML() {
  return src('dist/**/*.html').pipe(prettier()).pipe(dest('dist'))
}

// Watch
function watcher() {
  watch(['src/scss/**/*.scss', 'src/pug/**/*.pug'], parallel(css, html))
}

exports.default = parallel(serve, watcher)
exports.build = parallel(buildCSS, buildHTML)
