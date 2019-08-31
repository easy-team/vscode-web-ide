const Command = require('./app/lib/Comand');
module.exports = agent => {
  const command = new Command(agent);
  agent.messenger.on('easy-web-ide-command', args => {
    command.exec({ args }).then(result => {}, error => {
      console.log('>>>eror', error);
    });
  });
}
