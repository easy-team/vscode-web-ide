const path = require('path');
const fs = require('fs');

const EXT = ['.jsx', '.tsx', '.ts', '.js', '.json', '.css'];

exports.exist =  filepath => {
  return fs.existsSync(filepath);
}

exports.resolve = filepath => {
  if (this.exist(filepath)) {
    return filepath;
  }
  const ext = EXT.find(ext => {
    return this.exist(`${filepath}${ext}`)
  });
  return ext ? `${filepath}${ext}` : null;
}

exports.info= filepath => {
  const resolveFile = this.resolve(filepath);
  if (resolveFile) {
    return fs.readFileSync(resolveFile, 'utf8');
  }
  return null;
}

exports.getPackageEntry = (root, name) => {
  const moduleRoot = path.join(root, 'node_modules', name);
  const modulePkg = path.join(moduleRoot, 'package.json');
  return require(modulePkg).main  || 'index.js';
}

exports.resolveImportFile = (root, project, filepath, importModule) => {
  const projectdir = path.join(root, project);
  const filebasedir = path.dirname(filepath);
  let resolveImportModule = '';
  let node_modules = false;
  if (/^\.\//.test(importModule)) {
    resolveImportModule = path.join(root, filebasedir, importModule);
  } else if (/^(\.\/|\.\.\/)/.test(importModule)) {
    const importModuleDir = path.join(root, filebasedir);
    resolveImportModule = path.resolve(importModuleDir, importModule);
  } else {
    const entry = this.getPackageEntry(projectdir, importModule);
    resolveImportModule = path.join(projectdir, 'node_modules', importModule, entry);
    node_modules = true;
  }
  const resolveImportModuleFilepath = this.resolve(resolveImportModule);

  if (resolveImportModuleFilepath) {
    return {
      importModule,
      node_modules,
      filepath: path.relative(root, resolveImportModuleFilepath),
      code: this.info(resolveImportModuleFilepath),
    }
  }
  return null;
}
