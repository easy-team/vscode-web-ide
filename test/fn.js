const path = require('path');
const tool = require('node-tool-utils');
const { shell, chalk } = tool;
shell.exec('ls -lrt', { cwd: path.join(__dirname), async: true }, function(code, stdout, stderr) {
  console.log(code, stdout, stderr);
});