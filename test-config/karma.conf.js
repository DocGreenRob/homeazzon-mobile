//https://dev.azure.com/DoneRightSolutions/MyPad/_git/mypad-mobile/commit/674d303f5b3966f6d6c70bed64191217d973b15a?refName=refs/heads/497-e2e-testing&path=/test-config/karma.conf.js&_a=contents
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

var webpackConfig = require('./webpack.test.js');

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		files: [
			{
				pattern: './test-config/karma-test-shim.js',
				watched: true
			},
			{
				pattern: './src/assets/**/*',
				watched: false,
				included: false,
				served: true,
				nocache: false
			}
		],
		proxies: { '/assets/': '/base/src/assets/' },
		preprocessors: {
			'./test-config/karma-test-shim.js': ['webpack', 'sourcemap']
		},

		webpack: webpackConfig,
		webpackMiddleware: {
			stats: 'errors-only'
		},
		webpackServer: {
			noInfo: true
		},
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			dir: require('path').join(__dirname, '../coverage'),
			reports: ['html', 'lcovonly', 'text-summary'],
			fixWebpackSourcePaths: true
		},
		reporters: config.coverage ? ['progress', 'kjhtml', 'dots', 'coverage-istanbul'] : ['progress', 'kjhtml', 'dots'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false
	});
};
