import express, { Request, Response } from 'express';
import { verbose, Database } from 'sqlite3';
import { isAuthenticated, dbAll, dbGet } from './util';

const sqlite3 = verbose();
export const quizRouter = express.Router();
quizRouter.use(isAuthenticated);


interface QuestionResult {
  content: string,
  correctAnswer: number,
  penalty: number,
  userAnswer: number
  time: number,
  isCorrect: boolean
}

interface QuizResult {
  name: string,
  intro: string,
  correctCount: number,
  questionCount: number,
  totalTime: number,
  totalPenalty: number,
  finalTime: number,
  statistics: QuestionResult[]
}


quizRouter.get('/', (req: Request, res: Response) => {
  const db = new sqlite3.Database('mathquiz.db');

  db.all(`
    SELECT id, name, intro,
    CASE WHEN id IN (
      SELECT quizes.id 
      FROM quizes JOIN solved ON quizes.id = solved.quiz_id 
      WHERE solved.user_id = ?
    ) THEN true ELSE false END AS solved
    FROM quizes
  `, [req.session!.user.id], 
  
  (err, quizes) => {
    db.close();

    if (err) {
      res.status(500);
      res.json({ result: "database error" });
      return;
    }

    res.json(quizes);
  });
});


quizRouter.get('/:quiz_id', async (req: Request, res: Response) => {
  const db = new sqlite3.Database('mathquiz.db');

  try {
    if (await isSolved(db, req.session!.user.id, parseInt(req.params.quiz_id))) {
      db.close();
      res.status(400);
      res.json({ result: "quiz can be solved once" });
      return;
    }
  
    const quiz = await dbGet(
      db,
      `SELECT * FROM quizes WHERE id = ?`,
      [req.params.quiz_id]
    );
  
    const questions = await dbAll(
      db, 
      `
        SELECT questions.id AS id, questions.content AS content, questions.penalty AS penalty 
        FROM questions JOIN membership ON questions.id = membership.question_id 
        WHERE membership.quiz_id = ?
        ORDER BY questions.id
      `, 
      [req.params.quiz_id]
    );

    db.close();
    res.json({
      id: quiz.id,
      name: quiz.name,
      intro: quiz.intro,
      questions: questions
    });
  
  } catch (error) {
    db.close();
    res.status(500);
    res.json({ result: "database error" });
  }
});


quizRouter.post('/answer/:quiz_id', async (req: Request, res: Response) => {
  const db = new sqlite3.Database('mathquiz.db');
  
  try {
    if (await isSolved(db, req.session!.user.id, parseInt(req.params.quiz_id))) {
      db.close();
      res.status(400);
      res.json({ result: "quiz can be solved once" });
      return;
    }

    const questionsIDs = await dbAll(
      db,
      ` 
        SELECT questions.id AS id
        FROM questions JOIN membership ON questions.id = membership.question_id 
        WHERE membership.quiz_id = ?
        ORDER BY questions.id
      `,
      [req.params.quiz_id]
    );

    const answered: { [id: number]: boolean } = {};

    for (const answer of req.body) {
      answered[answer.id] = true;
    }

    for (const item of questionsIDs) {
      if (answered[item.id] === undefined) {
        res.status(400);
        res.json({ result: "all questions must be answered" });
        return;
      }
    }

    if (questionsIDs.length < req.body.length) {
      res.status(400);
      res.json({ result: "too many answers" });
      return;
    }

    db.serialize(() => {
      for (const item of req.body) {
        db.run(`
            INSERT INTO answers (user_id, question_id, quiz_id, answer, time)
            VALUES (?, ?, ?, ?, ?)
          `,
          [req.session!.user.id, item.id, req.params.quiz_id, item.answer, item.time]
        );
      }

      db.run(
        `INSERT INTO solved (user_id, quiz_id) VALUES (?, ?)`, 
        [req.session!.user.id, req.params.quiz_id]
      );
    });

    db.close();
    res.json({ result: "success" });
  
  } catch (error) {
    db.close();
    res.status(500);
    res.json({ result: "database error" });
  }
});


quizRouter.get('/result/:quiz_id', async (req: Request, res: Response) => {
  const db = new sqlite3.Database('mathquiz.db');
  
  try {
    if (!await isSolved(db, req.session!.user.id, parseInt(req.params.quiz_id))) {
      db.close();
      res.status(400);
      res.json({ result: "quiz has not been solved yet" });
      return;
    }

    const quiz = await dbGet(
      db,
      `SELECT * FROM quizes WHERE id = ?`,
      [req.params.quiz_id]
    );

    const results = await dbAll(
      db,
      `
        SELECT
          questions.content AS content,
          questions.answer AS answer,
          questions.penalty AS penalty,
          answers.answer AS userAnswer,
          answers.time AS time
        FROM questions JOIN answers ON questions.id = answers.question_id
        WHERE answers.quiz_id = ?
        ORDER BY questions.id
      `,
      [req.params.quiz_id]
    );

    for (const result of results) {
      result.isCorrect = result.answer === result.userAnswer;
    }

    const quizResult: QuizResult = {
      name: quiz.name,
      intro: quiz.intro,
      correctCount: totalCorrect(results),
      questionCount: results.length,
      totalTime: totalTime(results),
      totalPenalty: totalPenalty(results),
      finalTime: totalTime(results) + totalPenalty(results) * 1000,
      statistics: results
    };

    db.close();
    res.json(quizResult);
    
  } catch (error) {
    db.close();
    res.status(500);
    res.json({ result: "database error" });
  }
});


const isSolved = async (db: Database, userId: number, quizId: number) => {
  const solved = await dbGet(
    db,
    `SELECT * FROM solved WHERE user_id = ? AND quiz_id = ?`,
    [userId, quizId]
  );

  return solved !== undefined;
};


const totalCorrect = (results: QuestionResult[]) => {
  return results.reduce((acc: number, current: QuestionResult) => {
    return current.isCorrect ? ++acc : acc;
  }, 0);
};


const totalTime = (results: QuestionResult[]) => {
  return results.reduce((acc: number, current: QuestionResult) => {
    return acc + current.time;
  }, 0);
};


const totalPenalty = (results: QuestionResult[]) => {
  return results.reduce((acc: number, current: QuestionResult) => {
    return current.isCorrect ? acc : acc + current.penalty;
  }, 0);
};








