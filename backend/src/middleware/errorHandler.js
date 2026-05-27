function errorHandler(err, req, res, _next) {
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(status).json({ success: false, message });
}

module.exports = { errorHandler };

