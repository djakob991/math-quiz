import express, { Request, Response } from 'express';
import { verbose } from 'sqlite3';
import { compare, hash } from 'bcrypt';
import { isAuthenticated } from './util';

const sqlite3 = verbose();
export const accountRouter = express.Router();


accountRouter.post('/login', (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400);
    res.json({ result: "incorrect json format" });
    return;
  }

  const db = new sqlite3.Database('mathquiz.db');

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    db.close();

    if (err) {
      res.status(500);
      res.json({ result: "database error" });
      return;
    }

    if (!user) {
      res.status(401);
      res.json({ result: "incorrect credentials" });
      return;
    }

    compare(password, user.password).then(result => {
      if (result) {
        req.session!.user = {
          id: user.id,
          username: user.username,
          session_control: user.session_control
        };
      
        res.json({ result: "success", user: req.session!.user });
      
      } else {
        res.status(401);
        res.json({ result: "incorrect credentials" });
      }
    });
  });
});


accountRouter.get('/user-info', isAuthenticated, (req: Request, res: Response) => {
  res.json({ user: req.session!.user });
});


accountRouter.post('/logout', isAuthenticated, (req: Request, res: Response) => {
  delete(req.session!.user);
  res.json({ result: "success" });
});


accountRouter.post('/change-password', isAuthenticated, async (req: Request, res: Response) => {
  const newPassword = req.body.new_password;
  const repeatPassword = req.body.repeat_password;

  if (!newPassword || !repeatPassword) {
    res.status(400);
    res.json({ result: "incorrect json format" });
    return;
  }

  if (newPassword !== repeatPassword) {
    res.status(400);
    res.json({ result: "passwords must match" });
    return;
  }

  const db = new sqlite3.Database('mathquiz.db');
  const hashed = await hash(newPassword, 10);

  db.run(`UPDATE users SET password = ?, session_control = session_control + 1 WHERE id = ?`, [hashed, req.session!.user.id]);
  db.close();
  req.session!.user.session_control++;
  res.json({ result: "success" });
});





