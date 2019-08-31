module.exports = app => {
    return async (ctx, next) => {
        console.log('packet:', ctx.packet);
        ctx.socket.emit('easy-web-ide', 'packet received!');
        await next();
    };
};