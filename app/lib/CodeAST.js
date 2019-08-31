const babel = require('babel-core');
const type = require('babel-types');

exports.transformCodeToAST = function (code) {
  const importPlugin = {
    visitor: {
      ImportDeclaration(path) {
        const { node } = path;
        const source = node.source.value;
        let specifiers = node.specifiers;
        if (!type.isImportDefaultSpecifier(specifiers[0])) {
          specifiers = specifiers.map(specifier => {
            return type.importDeclaration(
              [type.importDefaultSpecifier(specifier.local)],
              type.stringLiteral(`${source}/lib/${specifier.local.name.toLowerCase()}`)
            )
          });
          path.replaceWithMultiple(specifiers);
        }
      }
    }
  }
  // https://github.com/babel/babel/issues/10154
  return babel.transform(code, {
    presets: ["react"],
    plugins: [
      importPlugin,
    ]
  });
}

/**
 * [ { source: 'react',
    imported: [ 'default', 'Component' ],
    specifiers: [ [Object], [Object] ] },
    { source: 'monaco-editor',
      imported: [ '*' ],
      specifiers: [ [Object] ] },
    { source: 'antd',
      imported: [ 'Icon', 'Tabs' ],
      specifiers: [ [Object], [Object] ] }
   ]
*/
exports.getImports = function(filepath, code) {
  if (/\.(js|jsx|ts|tsx)$/.test(filepath)) {
    const ast = exports.transformCodeToAST(code);
    return ast.metadata.modules.imports || [];
  }
  return [];
}