//import createHttpError from 'http-errors';

import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import { accountRouter } from './account';
import { quizRouter } from './quiz';
const connectSQLite3 = require('connect-sqlite3');
const SQLiteStore = connectSQLite3(session);

export const app = express();
const store = new SQLiteStore;
const corsOptions = {
  origin: true,
  credentials:  true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/static', express.static(process.cwd() + '/src/public'));

app.use(session({
  store: store,
  secret: 'your secret',
  cookie: { maxAge: 15 * 60 * 1000 } // 15 minutes
}));


app.use('/account', accountRouter);
app.use('/quiz', quizRouter);

app.listen(5000);