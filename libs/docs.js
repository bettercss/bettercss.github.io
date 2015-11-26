var resolve = require('resolve').sync;
var path = require('path');
var glob = require('glob');
var fs = require('fs-extra');
var marked = require('marked');
var _ = require('lodash');
var markedExample = require('./example.js');
var modules = require('./modules.js');

var base;
var libs;
var navigation;

// Setup marked/markedExample
var renderer = new marked.Renderer();
renderer.code = markedExample;

// Doc template base
base = {
	template:  _.template(fs.readFileSync(path.join(process.cwd(), '/templates/doc.html'), 'utf8')),
	styles: fs.readFileSync(path.join(process.cwd(), '/css/bettercss.min.css'), 'utf8')
};

navigation = modules.map(function(module) {
	var children = module.libs;

	children = children.map(function(lib) {

		return {
			title: _.capitalize(lib.title),
			link: path.join(process.cwd(), '/docs/', lib.title, '/index.html')
		}
	});

	return {
		title: module.title,
		children: children
	}
});

// Write lib files
var libs = modules.map(function(module) {
	return module.libs;
})
.reduce(function(a, b) {
	return a.concat(b);
});

// Write docs
libs.forEach(function(lib) {
	var pathToDoc = path.join(process.cwd(), '/docs/', lib.title, 'index.html');
	var body;

	body = base.template({
		doc: {
			title: _.capitalize(lib.title),
			content: marked(fs.readFileSync(lib.readMe, 'utf8'), { renderer: renderer }),
			info: {
				title: lib.module.name,
				link: 'https://github.com/bettercss/' + lib.module.title
			}
		},
		navigation: navigation,
		styles: base.styles
	});

	// Make dir if it doesn't exist
	fs.mkdirsSync(path.dirname(pathToDoc));

	// Write file
	fs.writeFileSync(pathToDoc, body, 'utf8');
});

// Clean up CSS
fs.unlinkSync(path.join(process.cwd(), '/css/bettercss.css'));
fs.unlinkSync(path.join(process.cwd(), '/css/bettercss.min.css'));

