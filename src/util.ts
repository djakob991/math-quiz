import { Request, Response, NextFunction } from 'express';
import { verbose, Database } from 'sqlite3';

const sqlite3 = verbose();

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.user) {
    res.status(401);
    res.json({ result: "no user logged in" });
    return;
  }
  
  const db = new sqlite3.Database('mathquiz.db');

  db.get(
    `SELECT session_control FROM users WHERE id = ?`, 
    [req.session!.user.id],
    (err, item) => {
      db.close();

      if (err) {
        res.status(500);
        res.json({ result: "database error" });
        return;
      }

      if (item.session_control !== req.session!.user.session_control) {
        delete(req.session!.user);
        res.status(401);
        res.json({ result: "no user logged in" });
        return;
      }

      next();
    }
  );
};


export const dbAll = (db: Database, sql: string, params: any) => {
  return new Promise<any[]>((resolve, reject) => {
    db.all(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


export const dbGet = (db: Database, sql: string, params: any) => {
  return new Promise<any>((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};