const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value ${value}: Please use another value!`;
  return new AppError(message, 400);
};

const handleJWTErrorDB = () =>
  new AppError('Invalid token, Please login in again!', 401);

const handleJWTExpireErrorDB = () =>
  new AppError('Your token has expired, Please login in again!', 401);

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data ${error.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted, error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error detail
  } else {
    // 1) log error
    console.log('Error 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTErrorDB();
    if (error.name === 'TokenExpiredError') error = handleJWTExpireErrorDB();

    sendErrorProd(error, res);
  }
};
