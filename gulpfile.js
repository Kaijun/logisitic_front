/*global -$ */
'use strict';
// generated on 2015-06-17 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var proxyMiddleware = require('http-proxy-middleware');

// var gutil = require('gulp-util');

gulp.task('styles', function () {
  return gulp.src('app/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src(['app/*.html', 'app/home-app/**/*.html', 'app/admin-app/**/*.html','app/help/**/*.html','app/price/**/*.html'], { base: 'app' })
    .pipe($.sourcemaps.init())
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({ mangle: false })))
    // .pipe($.if('*.js', $.uglify({ mangle: false }).on('error', gutil.log)))
    .pipe($.if('*.css', $.csso()))

    //添加timestamp在资源中
    // .pipe($.rev())

    //打包html中打包的资源
    .pipe(assets.restore())
    .pipe($.useref())

    //替换useref html中 打包后添加了timestamp的路径!
    // .pipe($.revReplace())

    //并不需要压缩Html
    // .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src(['app/images/**/*', 'app/home-app/images/**/*', 'app/admin-app/images/**/*' ,'app/help/images/**/*'], { base: 'app' })
    .pipe($.sourcemaps.init())
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'fonts'], function () {
  var proxyAuth = proxyMiddleware('/auth/', {target: 'http://0.0.0.0:8000'});
  var proxyApi = proxyMiddleware('/api/', {target: 'http://0.0.0.0:8000'});
  var proxyHome = proxyMiddleware('/home/', {target: 'http://0.0.0.0:8000'});
  var proxyAdmin = proxyMiddleware('/admin/', {target: 'http://0.0.0.0:8000'});
  var proxyPay = proxyMiddleware('/pay/', {target: 'http://0.0.0.0:8000'});
  var proxyPassword = proxyMiddleware('/password/', {target: 'http://0.0.0.0:8000'});

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components',
        '/scripts': 'app/scripts'
      },
      middleware: [proxyAuth, proxyApi, proxyHome, proxyAdmin, proxyPay, proxyPassword],
    }
  });

  // watch for changes
  gulp.watch([
    // 'app/*.html',
    // 'app/scripts/**/*.js',
    'app/**/*.html',
    'app/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
