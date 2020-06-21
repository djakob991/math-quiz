import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/app";

let should = chai.should();
chai.use(chaiHttp);


describe('Basic login correctness', () => {
  let agent = chai.request.agent(app);
  
  it('Try to fetch quizes without login', done => {
    agent.get('/quiz')
    .end((err, res) => {
      res.should.have.status(401);
      done();
    });
  });

  it('Cannot login with wrong credentials', done => {
    agent.post('/account/login')
    .send({ username: 'user1', password: 'wrong password' })
    .end((err, res) => {
      res.should.have.status(401);
      done();
    })
  })

  it('Login with correct credentials', done => {
    agent.post('/account/login')
    .send({ username: 'user1', password: 'pass1' })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.have.cookie('connect.sid');
      done();
    })
  })

  it('Fetch quizes after logging in', done => {
    agent.get('/quiz')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

  it('Logout', done => {
    agent.post('/account/logout')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

  it('Cannot fetch after logout', done => {
    agent.get('/quiz')
    .end((err, res) => {
      res.should.have.status(401);
      done();
    });
  });

});


describe('Password change correctness', () => {
  let agent1 = chai.request.agent(app);
  let agent2 = chai.request.agent(app);

  it('One user login on 2 agents', done => {
    agent1.post('/account/login')
    .send({ username: 'user1', password: 'pass1' })
    .then(res => {
      res.should.have.status(200);
      res.should.have.cookie('connect.sid');
      
      return agent2.post('/account/login')
        .send({ username: 'user1', password: 'pass1' })
    }).then(res => {
      res.should.have.status(200);
      res.should.have.cookie('connect.sid');
      done();
    });
  });

  it('passwords must match', done => {
    agent1.post('/account/change-password')
    .send({ new_password: "new", repeat_password: "different" })
    .then(res => {
      res.should.have.status(400);
      done();
    })
  });

  it('change password on first agent', done => {
    agent1.post('/account/change-password')
    .send({ new_password: "new", repeat_password: "new" })
    .then(res => {
      res.should.have.status(200);
      done();
    })
  });

  it('first agent is still logged in...', done => {
    agent1.get('/quiz')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

  it('... but the second is not', done => {
    agent2.get('/quiz')
    .end((err, res) => {
      res.should.have.status(401);
      done();
    });
  });

  it('login with new password', done => {
    agent2.post('/account/login')
    .send({ username: 'user1', password: 'new' })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.have.cookie('connect.sid');
      done();
    })
  })

});