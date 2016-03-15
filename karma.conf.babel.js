import webpackConfig  from './webpack.config.babel';

export default (config) => {
  config.set({
    browsers: [ 'Chrome' ],
    singleRun: true,
    frameworks: [ 'mocha' ],
    files: [
      'src/**/*.spec.js',
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],
    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap']
    },
    reporters: [ 'dots' ],
    webpack: {
      ...webpackConfig,
      devtool: 'inline-source-map',
    },
    webpackServer: {
      noInfo: true
    }
  });
};
