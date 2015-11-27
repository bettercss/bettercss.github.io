var path = require('path');

module.exports = [
    {
        title: 'getting started',
        safeName: 'docs',
        url: '/docs',
        destination: path.join(process.cwd(), '/docs/index.html'),
        src: path.join(process.cwd(), '/pages/getting-started.md'),
        type: 'page',
        package: {
            title: 'page'
        },
        breadcrumb: [
            {
                title: 'Home',
                link: '/'
            },
            {
                title: 'Docs',
                link: '/docs'
            }
        ]
    }
];