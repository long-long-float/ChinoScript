const gulp = require('gulp')
const ts   = require('gulp-typescript')
const pegjs = require('gulp-pegjs')
const merge = require('merge2')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const seq   = require('run-sequence')

gulp.task('build', () => {
  const tsProject = ts.createProject('tsconfig.json')
  const tsResult = tsProject.src().pipe(tsProject())

  return merge([
    tsResult.dts.pipe(gulp.dest('./definitions')),
    tsResult.js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir)),
    gulp.src('src/parser.pegjs').pipe(pegjs({ format: 'globals', exportVar: 'parser', cache: true })).pipe(gulp.dest('dist/src')),
  ])
})


gulp.task('browserify', () => {
  return browserify('./dist/src/browser.js')
    .bundle()
    .pipe(source('chinoscript.js'))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('_build-game', () => {
  return browserify('./dist/src/game.js')
    .bundle()
    .pipe(source('game.js'))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('build-game', (cb) => {
  seq('build', '_build-game', cb)
})

gulp.task('watch-build', () => {
  return gulp.watch(['src/*', 'test/*'], ['build'])
})
