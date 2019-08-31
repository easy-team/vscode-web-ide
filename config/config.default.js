const path = require('path');
const fs = require('fs');
module.exports = app => {
  const exports = {};

  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/ide.png'))
  };

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs')
  };

  exports.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  };

  exports.keys = '123456';

  exports.middleware = [
    'access'
  ];

  exports.reactssr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html')
  };

  exports.ide = {
    root: path.join(app.baseDir, 'dist'),
    exclude: [/^node_modules\/?/, '.DS_Store'],
  };

  exports.security = {
    csrf: {
      // cookieName: 'csrfToken',    // csrf token's cookie name
      // sessionName: 'csrfToken',   // csrf token's session name
      headerName: 'x-csrf-token', // request csrf token's name in header
    },
  }

  exports.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/webide': {
        connectionMiddleware: ['connect'],
        packetMiddleware: ['packet'],
      },
    }
  };

  return exports;
};
