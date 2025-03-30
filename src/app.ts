import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import routes from './app/route';
import cookieParser from 'cookie-parser';

export const app: Application = express();
app.use(cookieParser());
// parsers
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5175'],
    credentials: true,
  }),
);

// application routes
app.use('/api/v1', routes);
const test = (req: Request, res: Response) => {
  res.send('Hello World!');
  // Promise.reject();
};
   app.get('/', test);

// error handler
app.use(globalErrorHandler);

// not found
app.use(notFound);
export default app;
