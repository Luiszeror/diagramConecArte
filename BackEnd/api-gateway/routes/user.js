const { createProxyMiddleware } = require('http-proxy-middleware');
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

module.exports = (app) => {
  app.use('/usuarios', createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true
  }));
};
