const path = require('path');
const fs = require('fs');
const util = require('util');

module.exports = class FileTree {
  constructor(project, config) {
    this.config = config;
    this.project = project;
    this.root = config.root;
    this.exclude = config.exclude || [];
  }

  compare(a, b) {
    const _a = a.toUpperCase();
    const _b = b.toUpperCase();
    if (_a < _b) {
      return -1;
    }
    if (_a > _b) {
      return 1;
    }
    return 0;
  }

  isExclude(filepath) {
    const filename = path.basename(filepath);
    return this.exclude.some(rule => {
      // console.log('>>>filename', filename, rule instanceof String, rule === filename);
      if (typeof rule === 'string') {
        if (rule === filename) {
          return true;
        }
      } else if (rule instanceof RegExp) {
        const basedir = path.join(this.root, this.project);
        const basename = path.relative(basedir, filepath);
        if (rule.test(basename)) {
          return true;
        }
      }
      return false;
    });
  }

  async sortFiles(dir, listfiles) {
    const dirs = [];
    const files = [];
    listfiles.forEach(filename => {
      const filepath = path.join(dir, filename);
      if (!this.isExclude(filepath)) {
        if (fs.statSync(filepath).isDirectory()) {
          dirs.push(filename);
        } else {
          files.push(filename);
        }
      }
    });
    dirs.sort(this.compare);
    files.sort(this.compare);
    return dirs.concat(files);
  }

  async walk(tree, root, dir, node) {
    const files = await util.promisify(fs.readdir)(dir);
    const sortfiles = await this.sortFiles(dir, files);
    for (let filename of sortfiles) {
      const filepath = path.join(dir, filename);
      const cnode = {
        name: filename,
        filepath: path.relative(root, filepath),
        directory: false
      };
      if (node.children) {
        if (fs.statSync(filepath).isDirectory()) {
          cnode.children = [];
          cnode.directory = true;
          node.children.push(cnode);
          await this.walk(tree, root, filepath, cnode);
        } else {
          node.children.push(cnode);
        }
      } else if (fs.statSync(filepath).isDirectory()) {
        cnode.children = [];
        cnode.directory = true;
        tree.push(cnode);
        await this.walk(tree, root, filepath, cnode);
      } else {
        tree.push(cnode);
      }
    }
    return tree;
  }

  async getProjectTreeFiles() {
    const filepath = path.join(this.root, this.project);
    return this.walk([], this.root, filepath, {});
  }

}