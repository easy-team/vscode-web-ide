const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
module.exports = {
  target: 'web',
  entry: {
    login: 'app/web/page/login/index.jsx',
    admin: 'app/web/page/admin/index.jsx',
    ide: 'app/web/page/ide/index.jsx',
    // "editor.worker": 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
		// "json.worker": 'node_modules/monaco-editor/esm/vs/language/json/json.worker',
		// "css.worker": 'node_modules/monaco-editor/esm/vs/language/css/css.worker',
		// "html.worker": 'node_modules/monaco-editor/esm/vs/language/html/html.worker',
		// "ts.worker": 'node_modules/monaco-editor/esm/vs/language/typescript/ts.worker',
  },
  plugins: [
    new MonacoWebpackPlugin()
  ]
};
