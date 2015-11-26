var resolve = require('resolve').sync;
var path = require('path');
var glob = require('glob');
var fs = require('fs-extra');
var _ = require('lodash');

// We need to get these dynamical in the future
var modules = [
	'bettercss-base',
	'bettercss-components',
	'bettercss-utilities'
];
var libs;

// Need to think about modules that don't have libs??
modules = modules.map(function(moduleName) {
	var moduleResolve;

	// Error checking needed
	moduleResolve = resolve(moduleName, {
		paths: [],
		basedir: __dirname,
		extensions: [ '.css' ],
		moduleDirectory: 'node_modules'
	});

	return {
		name: moduleName,
		title: moduleName.replace('bettercss-',''),
		dir: path.dirname(moduleResolve),
		libs: []
	}
})
.map(function(module) {
	var libs;

	// What should we do if no libs returned?
	libs = glob.sync(path.join(module.dir, './libs/*'));

	// Errr dirty
	libs = parseLibsPaths(libs, module);

	return _.assign({}, module, {
		libs: libs
	});
});

function parseLibsPaths(libs, module) {

	return libs.map(function(libPath) {
		return {
			title: path.basename(libPath),
			readMe: path.join(libPath, 'README.md'),
			dir: libPath,
			module: module
		}
	});

}

module.exports = modules;