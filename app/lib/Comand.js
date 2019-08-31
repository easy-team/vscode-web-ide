const fs = require('fs');
const util = require('util');
const path = require('path');
const tool = require('node-tool-utils');
const { shell, chalk } = tool;

module.exports = class Command {

  constructor(agent) {
    this.agent = agent;
    this.ide = agent.config.ide;
  }

  sendToApp(data) {
    this.agent.messenger.sendToApp('easy-web-ide-command-exec-result', data);
  }

  async execCommand(config) {
    const { cwd, command } = config;
    const child = shell.exec(command, { cwd, async: true })
    return new Promise((resolve, reject) =>{
      child.stdout.on('data', data => {
        this.sendToApp({ text: data });
      });
      child.stderr.on('data', err => {
        this.sendToApp({ text: err });
      });
      child.stdout.on('close', data => {
        resolve(data);
      });
    });
  }

  async install(config = {}) {
    const { cwd, cmd = 'npm', registry = 'https://registry.npmjs.org/' } = config;
    const command = `${cmd} install --registry ${registry}`;
    return this.execCommand({ cwd, command });
  }

  async run(config) {
    const { cwd, cmd = 'npm' } = config;
    const command = `${cmd} run dev`;
    return await this.execCommand({ cwd, command });
  }


  async build(config) {
    const { cwd, cmd = 'npm' } = config;
    const command = `${cmd} run build`;
    return this.execCommand({ cwd, command });
  }


  async exec(config) {
    const { args } = config;
    const { action, project } = args;
    const cwd = path.join(this.ide.root, project);
    switch (action) {
      case 'install':
        return this.install({ cwd });
      case 'run':
        return await this.run({ cwd });
      case 'build':
        return this.build({ cwd });
      case 'save': 
        break;
      case 'create':
        break;
      default: break;
    }
  }
}