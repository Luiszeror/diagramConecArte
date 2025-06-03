const { createProxyMiddleware } = require('http-proxy-middleware');
const IMAGE_SERVICE_URL = process.env.IMAGE_SERVICE_URL;

module.exports = (app) => {
  app.use('/imagenes', createProxyMiddleware({
    target: IMAGE_SERVICE_URL,
    changeOrigin: true
  }));
};
