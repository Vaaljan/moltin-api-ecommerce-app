module.exports = function () {
	'use strict';

	var appDir = 'src/';
	var buildProd = 'builds/prod/';
	var buildASIS = 'builds/asis/';
	var buildDev = 'builds/develop/';
	var buildTemp = 'builds/temp/';

	var config = {
		serving:false,
		src: appDir,
		temp: buildTemp,
		dest: buildDev,
		changeToDev: function() {
			this.dest = buildDev;
		},
		changeToProd: function() {
			this.dest = buildProd;
		},
		changeToASIS: function() {
			this.dest = buildASIS;
		},
		jsToVet: [
			appDir + 'js/**/*.js',
			'./*.js'
		],
		sassToCompile: appDir + 'sass/**/*.scss',
		bootstrapPath: 'node_modules/bootstrap-sass/assets/stylesheets/bootstrap/',
		vendorJs: [
			],
		angularJs: [
			appDir + 'js/app.js',
			appDir + 'js/route/*.js',
			appDir + 'js/services/*.js',
			appDir + 'js/controllers/*.js',
			appDir + 'js/directives/*.js'
			],
		resourcesJs: [
			appDir + 'resources/jquery.min.js',
			appDir + 'resources/angular.min.js',
			appDir + 'resources/angular-route.min.js',
			appDir + 'resources/angular-cookies.min.js',
			'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
			appDir + 'resources/ui-bootstrap-tpls-1.1.2.min.js',
			appDir + 'resources/moltin.min.js',
			appDir + 'resources/underscore-min.js'

			],
		tempSources: [
			buildTemp + 'css/**/*.css',
			appDir + 'data/**/*.js',
			buildTemp + 'js/**/*.js'
			],
		injectSources: [
			buildDev + '*.css',
			buildDev + 'productData.js',
			buildDev + 'resources.js',
			buildDev + 'templates.js',
			buildDev + 'main.js'
		],
		views: appDir + 'views/**/*.html',
		fonts: [appDir + 'fonts/*.*', '!' + appDir + 'fonts/*.txt'],
		images: [appDir + 'images/*.*', '!' + appDir + 'images/*.txt'],
		assets: [appDir + 'assets/*.*', '!' + appDir + 'assets/*.txt'],
		sassConfigPartials: appDir + 'sass/partials',
		styleConfigFile: appDir + 'sass/config/style.config.js'
	};

	return config;
};
