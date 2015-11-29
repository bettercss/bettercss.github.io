var fs = require('fs');
var path = require('path');
var highlight = require('highlight.js');
var _ = require('lodash');
var templates = {
	html: _.template(fs.readFileSync(path.join(__dirname, '../templates/example-html.html'), 'utf8')),
	default: _.template(fs.readFileSync(path.join(__dirname, '../templates/example.html'), 'utf8'))
};

module.exports = function(code, lang) {
	var result = templates.default({
		code: highlight.highlightAuto(code, [lang]).value
	});

	if (lang && lang.match(/^html/)) {
		result = templates.html({
			rendered: code,
			code: highlight.highlight(lang, code).value
		});
	}

	return result;
};
