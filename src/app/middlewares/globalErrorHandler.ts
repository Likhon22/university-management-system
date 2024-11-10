import { ErrorRequestHandler } from 'express';
import config from '../config';
import { ZodError } from 'zod';
import handleZodError from '../error/handleZodError';
import handleValidationError from '../error/handleValidationError';
import { TErrorSources } from '../interface/error';
import handleCastError from '../error/handleCastError';
import handleDuplicateError from '../error/handleDuplicateError';
import AppError from '../error/AppError';

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  let errorSources: TErrorSources = [
    { path: '', message: 'Something went wrong' },
  ];

  if (err instanceof ZodError) {
    const simpliFiedError = handleZodError(err);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorSources = simpliFiedError?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simpliFiedError = handleValidationError(err);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorSources = simpliFiedError?.errorSources;
  } else if (err?.name === 'CastError') {
    const simpliFiedError = handleCastError(err);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorSources = simpliFiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simpliFiedError = handleDuplicateError(err);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorSources = simpliFiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    stack:
      config.node_env === 'development' && err.stack ? err.stack : undefined,
  });
};

export default globalErrorHandler;
