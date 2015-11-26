var fs = require('fs');
var path = require('path');
var highlight = require('highlight.js');
var _ = require('lodash');
var template = _.template(fs.readFileSync(path.join(__dirname, '../templates/example.html'), 'utf8'));

module.exports = function(code, lang) {
	var result = '<pre>' + highlight.highlightAuto(code, [lang]).value + '</pre>';

	if (lang && lang.match(/^html/)) {
		result = template({
			rendered: code,
			code: highlight.highlight(lang, code).value
		});
	}

	return result;
};
