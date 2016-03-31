'use strict';

import gulp from 'gulp';
import rimraf from 'rimraf';
import babel from 'gulp-babel';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import coveralls from 'gulp-coveralls';
import minimist from 'minimist';
import eslint from 'gulp-eslint';

const isparta = require('isparta');

let watching = false;

const unitTestSrc = './test/unit/**/*.js';

const knownUnitOptions = {
  string: ['spec'],
  default: {spec: unitTestSrc}
};

let unitOptions = minimist(process.argv.slice(2), knownUnitOptions);

function onError(err) {
  console.log(err.toString());
  if (watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}

/**
 * Clean up build.
 */
gulp.task('clean', (done) => {
  rimraf.sync('lib');
  done();
});

/**
 * Lint source.
 */
gulp.task('eslint', [ 'clean' ], () => {
  return gulp.src('./src/**/*.js')
    .pipe(eslint({
      configFile: './.eslintrc.json'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

/**
 * Transpile source.
 */
gulp.task('transpile', [ 'eslint' ], () => {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2016-node5']
    }))
    .pipe(gulp.dest('lib'));
});

/**
 * Instrument source for code coverage.
 */
gulp.task('instrument', [ 'transpile' ], () => {
  let includeUntested = (unitOptions.spec == unitTestSrc);
  return gulp.src([ './src/**/*.js' ])
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: includeUntested
    }))
    .pipe(istanbul.hookRequire());
});

/**
 * Unit tests.
 */
gulp.task('unitTest', [ 'instrument' ], () => {
  let global = 90;
  if (unitOptions.spec != unitTestSrc) {
    global = 0;
  }

  let mochaOpts = {
    reporter: 'spec',
    bail: !watching
  };
  let thresholds = {
    thresholds: {
      global: global
    }
  }

  return gulp.src([ unitOptions.spec ], {read: false})
    .pipe(mocha(mochaOpts))
    .on('error', onError)
    .pipe(istanbul.writeReports({dir:'./coverage/unit'}))
    .pipe(istanbul.enforceThresholds(thresholds));
});

/**
 * Functional tests.
 */
gulp.task('functionalTest', [ 'unitTest' ], () => {
  let mochaOpts = {
    reporter: 'spec',
    bail: !watching
  };
  return gulp.src([ './test/functional/**/*.js' ], {read: false})
    .pipe(mocha(mochaOpts))
    .on('error', onError);
});

/**
 * Functional tests only.
 */
gulp.task('functionalTestOnly', [ 'instrument' ], () => {
  let mochaOpts = {
    reporter: 'spec',
    bail: !watching
  };
  return gulp.src([ './test/functional/**/*.js' ], {read: false})
    .pipe(mocha(mochaOpts))
    .on('error', onError);
});

/**
 * Publish coverage to coveralls.io.
 */
gulp.task('coveralls', [ 'functionalTest' ], () => {
  return gulp.src('./coverage/unit/lcov.info')
    .pipe(coveralls());
});

gulp.task('travisTest', [ 'coveralls' ]);


/**
 * Default task.
 */
gulp.task('default', [ 'functionalTest' ]);
