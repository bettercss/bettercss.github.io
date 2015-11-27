var path = require('path');
var fs = require('fs-extra');

// Remove unused CSS as we inject source into documents.
fs.unlinkSync(path.join(process.cwd(), '/css/bettercss.css'));
fs.unlinkSync(path.join(process.cwd(), '/css/bettercss.min.css'));