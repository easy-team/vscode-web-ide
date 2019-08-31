
module.exports = app => {
  app.io.route('connect', app.io.controller.socket.connect);
  app.io.route('disconnect', app.io.controller.socket.disconnect);
  app.io.route('webide', app.io.controller.socket.message);
  app.get('/ide', app.controller.ide.index);
  app.get('/login', app.controller.admin.login);
  app.get('/api/project/list', app.controller.project.list);
  app.get('/api/project/info', app.controller.project.info);
  app.get('/api/project/file/read', app.controller.project.read);
  app.post('/api/project/file/resolve', app.controller.project.resolve);
  app.post('/api/project/file/save', app.controller.project.save);
  app.post('/api/project/command', app.controller.cmd.index);
  app.get('/(.*?)', app.controller.admin.index);
};
