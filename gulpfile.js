var gulp = require('gulp');
  babel = require('gulp-babel'),
  gutil = require('gulp-util'),
  fork = require('child_process').fork,
  async = require('async'),
  mocha = require('mocha');

// Gulp auto restart code from nairou:
//   https://gist.github.com/narirou/650b9b8d95263ed7e939

var app = {
  instance: null,

  path: 'app-build/bin/www',

  env: { NODE_ENV: 'development', port: 3000 },

  start: function (callback) {
    app.instance = fork(app.path, { silent: true, env: app.env });

    if (app.instance) {
      gutil.log(gutil.colors.cyan('Starting'), 'express server listening on port', app.env.port);

      app.instance.stdout.pipe(process.stdout);
      app.instance.stderr.pipe(process.stderr);
    }

    callback && callback();
  },

  stop: function (callback) {
    if (app.instance) {
      gutil.log(gutil.colors.red('Stopping'), 'express server ( PID:', app.instance.pid, ')');

      app.instance.kill('SIGTERM');
    }

    callback && callback();
  },

  restart: function (event) {
    async.series([
      app.stop,
      app.start
    ]);
  }
};

gulp.task('build', function () {
  return gulp.src('app/**/*')
    .pipe(babel())
    .pipe(gulp.dest('app-build'));
});

gulp.task('server', function(callback) {
  app.start(callback);
});

gulp.task('watch', ['build'], function () {
  app.start();
  gulp.watch('app/**/*', ['build', app.restart]);
});

gulp.task('default', ['build']);
