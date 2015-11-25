var resolve = require('resolve').sync;
var path = require('path');
var glob = require('glob');
var objectAssign = require('object-assign');

var modules = [
	'bettercss-base',
	'bettercss-components',
	'bettercss-utilities'
];


modules = modules.map(function(moduleName) {
	var modulePath = resolveModule(moduleName);

	return {
		realName: moduleName,
		name: moduleName.replace('bettercss-',''),
		dir: path.dirname(modulePath),
		libs: []
	}
})
.map(function(moduleObj) {
	var libs  = resolveLibs(moduleObj);

	return objectAssign({}, moduleObj, {
		libs: libs
	});
});

console.log(modules);

function resolveModule(moduleName) {
	return resolve(moduleName, {
		paths: [],
		basedir: __dirname,
		extensions: [ '.css' ],
		moduleDirectory: 'node_modules'
	});
}

function resolveLibs(module) {
	var searchIn = path.join(module.dir, './libs/*');
	return glob.sync(searchIn);
}

