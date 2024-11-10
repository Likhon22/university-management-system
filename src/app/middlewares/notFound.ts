/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const statusCode = 404;
  res.status(statusCode).json({
    success: false,
    message: 'Api is Not found',
    error: '',
  });
};

export default notFound;
