var marked = require('marked');
var path = require('path');
var _ = require('lodash');
var fs = require('fs-extra');
var cssstats = require('cssstats');
var humanize = require('humanize');

var libraries = require('./libraries.js');
var pages = require('./pages.js');
var example = require('./example.js');
var documents;
var base;
var navigation;

// Marked Renderer
var renderer = new marked.Renderer();
renderer.code = example;

base = {
	templates: {
		document: _.template(fs.readFileSync(path.join(process.cwd(), '/templates/document.html'), 'utf8')),
		index: _.template(fs.readFileSync(path.join(process.cwd(), '/templates/index.html'), 'utf8'))
	},
	css: fs.readFileSync(path.join(process.cwd(), '/css/bettercss.min.css'), 'utf8')
};

documents = pages.concat(libraries);

navigation = _.groupBy(documents, function (document) {
	return document.package.title;
});

// Write Documents
documents.forEach(function (document) {
	var content;
	var src;
	var stats;

	// Homepage requires a different setup.
	if (document.type == 'index') {

		stats = cssstats(base.css);

		content = base.templates.index({
			css: base.css,
			stats: {
				libraries: libraries.length,
				css: {
					size: humanize.filesize(stats.gzipSize),
					declarations: stats.declarations.total,
					rules: stats.rules.total
				}
			}
		});

	} else {
		// Read markdown source
		src = marked(fs.readFileSync(document.src, 'utf8'), {renderer: renderer});

		content = base.templates.document({
			title: document.title,
			content: src,
			breadcrumb: document.breadcrumb,
			package: document.package,
			css: base.css,
			navigation: navigation,
			type: document.type
		});
	}

	// Make dir if it doesn't exist
	fs.mkdirsSync(path.dirname(document.destination));

	// Write file
	fs.writeFileSync(document.destination, content, 'utf8');
});