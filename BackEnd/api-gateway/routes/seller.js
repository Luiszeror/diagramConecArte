const { createProxyMiddleware } = require('http-proxy-middleware');
const SELLER_SERVICE_URL = process.env.SELLER_SERVICE_URL;

module.exports = (app) => {
  app.use('/vendedores', createProxyMiddleware({
    target: SELLER_SERVICE_URL,
    changeOrigin: true
  }));
};
