// Central error handler. Keeps error responses consistent and avoids
// leaking stack traces to clients in production.
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    status === 500 ? "Something went wrong on our end. Please try again." : err.message;

  res.status(status).json({ message });
}

function notFound(req, res) {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
