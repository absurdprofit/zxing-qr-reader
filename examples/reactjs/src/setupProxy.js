module.exports = (app) => {
  app.use((_, res, next) => {
    res.setHeader("Service-Worker-Allowed", "/");
    next();
  });
};