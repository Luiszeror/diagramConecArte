const { createProxyMiddleware } = require('http-proxy-middleware');
const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL;

module.exports = (app) => {
  app.use('/conversaciones', createProxyMiddleware({
    target: CHAT_SERVICE_URL,
    changeOrigin: true
  }));
};
