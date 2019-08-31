const path = require('path');
const fs = require('fs');
const util = require('util');
const FileTree = require('../lib/FileTree');
module.exports = app => {
  return class AdminController extends app.Controller {
    async index(ctx) {
      const ide = ctx.app.config.ide;
      const { project } = ctx.query;
      /// TODO: the project need safe check, pevent illegal reading 
      const fileTree = new FileTree(project, ide);
      const tree = await fileTree.getProjectTreeFiles();
      await ctx.renderClient('ide.js',{
        tree: {
          name: project,
          toggled: true,
          children: tree
        }
      });
    }
  };
};