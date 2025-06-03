const { createProxyMiddleware } = require('http-proxy-middleware');
const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL;

module.exports = (app) => {
  app.use('/resenas', createProxyMiddleware({
    target: REVIEW_SERVICE_URL,
    changeOrigin: true
  }));
};
