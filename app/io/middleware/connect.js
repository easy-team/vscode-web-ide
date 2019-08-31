module.exports = app => {
  return async (ctx, next) => {
    ctx.socket.emit('easy-web-ide', { time: new Date(), text: 'connected!' });
    app.messenger.on('easy-web-ide-command-exec-result', data => {
      ctx.socket.emit('easy-web-ide', { time: new Date(), ...data });
    });
    await next();
  };
};