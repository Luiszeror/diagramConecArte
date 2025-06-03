const { createProxyMiddleware } = require('http-proxy-middleware');
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL;

module.exports = (app) => {
  app.use('/pagos', createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true
  }));
};
