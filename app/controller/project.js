const path = require('path');
const fs = require('fs');
const util = require('util');
const FileTree = require('../lib/FileTree');
const CodeAST = require('../lib/CodeAST');
const FileUtil = require('../lib/FileUtil');
module.exports = app => {
  return class ProjectController extends app.Controller {
    async list(ctx) {
      const root = ctx.app.config.ide.root;
      const files = await util.promisify(fs.readdir)(root);
      const list = files.filter(file => {
        return !['.DS_Store'].includes(file);
      });
      ctx.body = { list };
    }

    async info(ctx) {
      const ide = ctx.app.config.ide;
      const { project } = ctx.query;
      /// TODO: the project need safe check, pevent illegal reading 
      const fileTree = new FileTree(project, ide);
      const tree = await fileTree.getProjectTreeFiles();
      ctx.body = {
        project: {
          name: project,
          toggled: true,
          children: tree
        }
      };
    }

    async read(ctx) {
      const root = ctx.app.config.ide.root;
      const { project, filepath } = ctx.query;
      const absFilepath = path.join(root, filepath);
      /// TODO: the file need safe check, pevent illegal reading 
      const code = await util.promisify(fs.readFile)(absFilepath, 'utf8');
      const imports = CodeAST.getImports(filepath, code);
      ctx.body = {
        code,
        imports
      };
    }

    async resolve(ctx) {
      const root = ctx.app.config.ide.root;
      const { project, filepath, importModules } = ctx.request.body || {};
      ctx.body = importModules.map(importModule => {
        return FileUtil.resolveImportFile(root, project, filepath, importModule);
      });
    }

    async save(ctx) {
      const root = ctx.app.config.ide.root;
      const { project, filepath, code } = ctx.request.body || {};;
      const absFilepath = path.join(root, filepath);
      /// TODO: the file need safe check, pevent illegal reading 
      await util.promisify(fs.writeFile)(absFilepath, code);
      ctx.body = 'success';
    }
  };
};