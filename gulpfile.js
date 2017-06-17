const gulp = require('gulp')
const ts   = require('gulp-typescript')
const merge = require('merge2')

gulp.task('build', () => {
  const tsProject = ts.createProject('tsconfig.json')
  const tsResult = tsProject.src().pipe(tsProject())

  return merge([
    tsResult.dts.pipe(gulp.dest('./definitions')),
    tsResult.js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
  ])
})
