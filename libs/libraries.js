var path = require('path');
var glob = require('glob');
var _ = require('lodash');

// Make this dynamic at some point
var modules = [
    'bettercss-base',
    'bettercss-components',
    'bettercss-utilities'
];

module.exports =  modules.map(function(module) {
    return glob.sync(path.join(process.cwd(), '/node_modules/**/', module, '/libs/*'));
}).filter(function(library) {
    return library.length;
}).reduce(function(a, b) {
    return a.concat(b);
}).map(function(library) {
    var librarySlug = path.basename(library);
    var libraryTitle = librarySlug.replace(/-/g, ' ');
    var packagePath = path.dirname(path.dirname(library));
    var packageTitle = path.basename(packagePath);


    return {
        title: libraryTitle,
        safeName: librarySlug,
        url: path.join('/docs/', librarySlug),
        destination: path.join(process.cwd(), '/docs/', librarySlug, '/index.html'),
        src: path.join(library, '/README.md'),
        type: 'doc',
        package: {
            title: packageTitle,
            path: packagePath,
            link: 'https://github.com/bettercss/' + packageTitle.replace(/bettercss-/g, '')
        },
        breadcrumb: [
            {
                title: 'Home',
                link: '/'
            },
            {
                title: 'Docs',
                link: '/docs'
            },
            {
                title: libraryTitle,
                link: '/docs/' + librarySlug
            }
        ]
    };
});

