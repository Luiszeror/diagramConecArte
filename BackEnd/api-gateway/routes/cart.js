const { createProxyMiddleware } = require('http-proxy-middleware');
const CART_SERVICE_URL = process.env.CART_SERVICE_URL;

module.exports = (app) => {
  app.use('/carritos', createProxyMiddleware({
    target: CART_SERVICE_URL,
    changeOrigin: true
  }));
};
