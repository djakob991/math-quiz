
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var bcrypt = require('bcrypt');


var databaseName = 'mathquiz.db';

if (fs.existsSync(databaseName)) {
  fs.unlinkSync(databaseName);
}

var db = new sqlite3.Database(databaseName);

var testPass1 = 'pass1';
var hash1 = bcrypt.hashSync(testPass1, 10);
var testPass2 = 'pass2';
var hash2 = bcrypt.hashSync(testPass2, 10);
var testPass3 = 'pass3';
var hash3 = bcrypt.hashSync(testPass3, 10);

db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username VARCHAR NOT NULL, 
      password VARCHAR NOT NULL,
      session_control INTEGER NOT NULL
    )
  `);
  
  db.run(`
    CREATE TABLE quizes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name VARCHAR NOT NULL, 
      intro VARCHAR NOT NULL
    )
  `);
  
  db.run(`
    CREATE TABLE questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      content VARCHAR NOT NULL, 
      answer INTEGER NOT NULL, 
      penalty INTEGER NOT NULL
    )
  `);
  
  db.run(`
    CREATE TABLE membership (
      quiz_id INTEGER, 
      question_id INTEGER,  
      FOREIGN KEY(quiz_id) REFERENCES quizes(id),
      FOREIGN KEY(question_id) REFERENCES questions(id),
      UNIQUE(quiz_id, question_id)
    )
  `);

  db.run(`
    CREATE TABLE answers (
      user_id INTEGER,
      question_id INTEGER,
      quiz_id INTEGER,
      answer INTEGER NOT NULL,
      time INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(question_id) REFERENCES questions(id),
      FOREIGN KEY(quiz_id) REFERENCES quizes(id),
      UNIQUE(user_id, question_id, quiz_id)
    )
  `);

  db.run(`
    CREATE TABLE solved (
      user_id INTEGER,
      quiz_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(quiz_id) REFERENCES quizes(id),
      UNIQUE(user_id, quiz_id)
    )
  `);


  db.run("INSERT INTO users (username, password, session_control) VALUES ('user1', ?, 1)", [hash1]);
  db.run("INSERT INTO users (username, password, session_control) VALUES ('user2', ?, 1)", [hash2]);
  db.run("INSERT INTO users (username, password, session_control) VALUES ('user3', ?, 1)", [hash3]);
  
  db.run("INSERT INTO quizes (name, intro) VALUES ('great quiz', 'liczyc kazdy moze')");
  db.run("INSERT INTO quizes (name, intro) VALUES ('another quiz', 'liczyc nie kazdy moze')");

  db.run("INSERT INTO questions (content, answer, penalty) VALUES ('2+2', 4, 30)");
  db.run("INSERT INTO questions (content, answer, penalty) VALUES ('2+3', 5, 29)");
  db.run("INSERT INTO questions (content, answer, penalty) VALUES ('2+4', 6, 28)");
  db.run("INSERT INTO questions (content, answer, penalty) VALUES ('2+5', 7, 27)");
  db.run("INSERT INTO questions (content, answer, penalty) VALUES ('2+6', 8, 26)");
  db.run("INSERT INTO questions (content, answer, penalty) VALUES ('2+7', 9, 25)");
  db.run("INSERT INTO questions (content, answer, penalty) VALUES ('2+8', 10, 24)");
  db.run("INSERT INTO questions (content, answer, penalty) VALUES ('2+9', 11, 23)");

  db.run("INSERT INTO membership (quiz_id, question_id) VALUES (1, 1)");
  db.run("INSERT INTO membership (quiz_id, question_id) VALUES (1, 2)");
  db.run("INSERT INTO membership (quiz_id, question_id) VALUES (1, 3)");
  db.run("INSERT INTO membership (quiz_id, question_id) VALUES (2, 4)");
  db.run("INSERT INTO membership (quiz_id, question_id) VALUES (2, 5)");
  db.run("INSERT INTO membership (quiz_id, question_id) VALUES (2, 6)");

});

db.close();
