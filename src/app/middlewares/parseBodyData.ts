import { NextFunction, Request, Response } from 'express';
const parseBodyData = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = JSON.parse(req.body.data);
    next();
  } catch (error) {
    next(error);
  }
};

export default parseBodyData;
