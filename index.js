var resolve = require('resolve').sync;
var path = require('path');
var glob = require('glob');
var fs = require('fs-extra');
var marked = require('marked');
var _ = require('lodash');

var docBaseTemplate;
var docStyles;
var modules = [
	'bettercss-base',
	'bettercss-components',
	'bettercss-utilities'
];
var libs;

// Doc template base
docBaseTemplate = _.template(fs.readFileSync(path.join(__dirname, '/templates/index.html'), 'utf8'));
docStyles = fs.readFileSync(path.join(__dirname, '/css/output.css'), 'utf8');

// Prepare modules
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

	return _.assign({}, moduleObj, {
		libs: libs
	});
});

// Split libs
libs = modules.map(function(moduleObj) {
	return moduleObj.libs
})
.reduce(function(a, b) {
	return a.concat(b);
})
.map(function(libPath) {
	return parseLibPath(libPath);
});


// Write lib files
libs.forEach(function(libObj) {
	writeDoc(libObj);
});





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

function parseLibPath(libPath) {
	return {
		name: path.basename(libPath),
		readme: path.join(libPath, 'README.md'),
		dir: libPath
	}
}

function writeDoc(obj) {
	var pathToDoc = path.join(__dirname, '/docs/', obj.name, 'index.html');
	var readMeContent;
	var body;

	readMeContent = fs.readFileSync(obj.readme, 'utf8');

	body = docBaseTemplate({
		content: marked(readMeContent),
		nav: {},
		styles: docStyles
	});

	fs.mkdirsSync(path.dirname(pathToDoc));
	fs.writeFileSync(pathToDoc, body, 'utf8');
}

