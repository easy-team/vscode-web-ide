'use strict';
const path = require('path');
const resolve = (filepath) => path.resolve(__dirname, filepath);
module.exports = {
  port: 9005,
  framework: 'react',
  entry: {
    index: 'src/page/home/index.tsx'
  },
  template: 'src/view/layout.html',
  loaders: {
    babel: {
      include: [resolve('src'), resolve('node_modules')]
    },
    less: {
      include: [resolve('src'), resolve('node_modules')],
      options: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': 'red',
          'link-color': '#1DA57A',
          'border-radius-base': '2px'
        }
      }
    },
    typescript: true
  },
  plugins: {
    imagemini: false
  },
  done() {
    console.log('---webpack compile finish---');
  }
};