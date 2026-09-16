function errorHandler(error, req, res, next) {
  const message = typeof error === 'string' ? error : 'An unexpected server error occurred.';
  if (typeof error !== 'string') console.error(error);
  res.status(error?.statusCode || 500).json({ success: false, message });
}

module.exports = errorHandler;