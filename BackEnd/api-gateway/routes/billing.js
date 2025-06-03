const { createProxyMiddleware } = require('http-proxy-middleware');
const BILLING_SERVICE_URL = process.env.BILLING_SERVICE_URL;

module.exports = (app) => {
  app.use('/facturas', createProxyMiddleware({
    target: BILLING_SERVICE_URL,
    changeOrigin: true
  }));
};
