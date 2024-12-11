import { Response } from 'express';

type TMeta = {
  totalDocuments: number;
  totalPage: number;
  page: number;
  limit: number;
};
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};

export default sendResponse;
