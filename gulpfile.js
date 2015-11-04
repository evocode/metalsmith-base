// Common
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var gulp = require('gulp');
var Metalsmith = require('metalsmith');

// Assets
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var webpack = require('webpack');

// Site
var site = require('./site');

// Handlebars
var Handlebars = require('handlebars');
var HandlebarsLib = require('./lib/handlebars')(Handlebars);

// Configuration
var args = {
  build: !!argv.build,
  production: !!argv.production
};

// Metalsmith
function setupMetalsmith(callback) {
  var ms = new Metalsmith(process.cwd());
  var msconfig = site.metalsmith || {};
  var msplugins = msconfig.plugins || {};

  ms.source(msconfig.config.contentRoot);
  ms.destination(msconfig.config.destRoot);
  ms.metadata(msconfig.metadata);

  Object.keys(msplugins).forEach(function(key) {
    var plugin = require(key);
    var options = msplugins[key];

    if (options._metalsmith_if !== undefined) {
      var condition = false;
      if (options._metalsmith_if === "production") {
        condition = argv.production;
      } else if (options._metalsmith_if === "build") {
        condition = argv.build;
      }

      if (condition) {
        options._metalsmith_if = undefined;
        delete options._metalsmith_if;
        ms.use(plugin(options));
      }
    } else {
      ms.use(plugin(options));
    }
  });

  ms.build(function(err) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    callback();
  });
}

//Gulp tasks

gulp.task('metalsmith', function(callback) {
  setupMetalsmith(callback);
});

gulp.task('vendor', function() {
  return gulp.src(site.vendor)
    .pipe(gulp.dest(path.join(__dirname, site.metalsmith.config.assetRoot, 'vendor')));
});

gulp.task('styles', function() {
  return gulp.src(path.join(__dirname, site.metalsmith.config.styleRoot, 'app.scss'))
    .pipe(sass({
      sourceComments: args.production ? false : true,
      outputStyle: args.production ? 'compressed' : 'expanded',
      includePaths: site.styles.include,
      errLogToConsole: true,
      onError: console.log
    }))
    .pipe(autoprefixer({
      browsers: site.styles.prefix,
      cascade: false
    }))
    .pipe(gulp.dest(path.join(__dirname, site.metalsmith.config.assetRoot, 'assets')));
});

gulp.task('webpack', function(callback) {
  var webpackPlugins = [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(args.production ? 'production' : 'development'),
        },
      })
  ];

  if (args.production) {
    webpackPlugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  }

  var webpackConfig = {
    context: path.join(__dirname, site.metalsmith.config.scriptRoot),
    entry: {
      app: './app',
      vendor: ['jquery']
    },
    output: {
      path: path.join(__dirname, site.metalsmith.config.assetRoot, 'assets'),
      filename: '[name].js'
    },
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel?optional[]=runtime&stage=0'
        }
      ]
    },
    plugins: webpackPlugins
  };

  webpack(webpackConfig, function(err, stats) {
    if (err) {
      return callback(err);
    }

    //console.log(stats.toString({}));
    callback();
  });
});

gulp.task('scripts', ['webpack']);

gulp.task('watch', ['default'], function() {
  gulp.watch(['gulpfile.js', 'site.js'], ['default']);
  gulp.watch([site.metalsmith.config.styleRoot+'/**/*'], ['styles']);
  gulp.watch([site.metalsmith.config.scriptRoot+'/**/*'], ['scripts']);
  gulp.watch([
    site.metalsmith.config.contentRoot+'/**/*',
    site.metalsmith.config.layoutRoot+'/**/*',
    site.metalsmith.config.assetRoot+'/**/*'
  ], ['metalsmith']);
});

gulp.task('server', ['default', 'watch'], function(callback) {
  var http = require('http');
  var serveStatic = require('serve-static');
  var finalhandler = require('finalhandler');

  var serve = serveStatic(site.metalsmith.config.destRoot, {
    "index": ['index.html', 'index.htm']
  });

  var server = http.createServer(function(req, res){
    var done = finalhandler(req, res);
    serve(req, res, done);
  })

  var serverPort = Math.floor((Math.random() * 1000) + 3000);
  if (argv.port) {
    serverPort = parseInt(argv.port);
  }

  server.listen(serverPort, function() {
    console.log("Server: http://localhost:%s", serverPort);
    callback();
  });
});

gulp.task('default', ['vendor', 'scripts', 'styles', 'metalsmith']);
