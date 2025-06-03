const { createProxyMiddleware } = require('http-proxy-middleware');
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

module.exports = (app) => {
  app.use('/productos', createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true
  }));
};
