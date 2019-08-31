module.exports = app => {
  return class CommandController extends app.Controller {
    async index(ctx) {
      const body = ctx.request.body || {};
      ctx.app.messenger.sendToAgent('easy-web-ide-command', body);
      ctx.body = { message: 'success' };
    }
  };
};