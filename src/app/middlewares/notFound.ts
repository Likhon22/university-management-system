import { TGenericErrorResponse } from './../interface/error';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const errorResponse: TGenericErrorResponse = {
    statusCode: 404,
    message: 'API is not found',
    errorSources: [{ path: req.originalUrl, message: 'API is not found' }],
  };
  res.status(errorResponse.statusCode).json(errorResponse);
};

export default notFound;
