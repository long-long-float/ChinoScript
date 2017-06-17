const gulp = require('gulp')
const ts   = require('gulp-typescript')
const pegjs = require('gulp-pegjs')
const merge = require('merge2')

gulp.task('build', () => {
  const tsProject = ts.createProject('tsconfig.json')
  const tsResult = tsProject.src().pipe(tsProject())

  return merge([
    gulp.src('src/parser.pegjs').pipe(pegjs({ format: 'globals', exportVar: 'parser' })).pipe(gulp.dest('src')),
    tsResult.dts.pipe(gulp.dest('./definitions')),
    tsResult.js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
  ])
})

gulp.task('watch-build', () => {
  return gulp.watch('src/*', ['build'])
})