module.exports = app => {
  return class WebIDESocketController extends app.Controller {
    async connect() {
      console.log('>>>socket connect');
    }
    async ide() {
      console.log('>>>socket data', this.ctx.args);
      await this.ctx.socket.emit('easy-web-ide', `Hi! I've got your message: ${message}`);
    }
    async disconnect() {
      console.log('>>>socket disconnect');
    }
  }
};