import { Answers } from "./Quiz";


export interface QuizBrieaf {
  id: number,
  name: string,
  intro: string,
  solved: boolean
}

export interface ChangePasswordData {
  new_password: string,
  repeat_password: string
}


export class HttpService {
  urlBase = 'http://localhost:5000';

  login(username: string, password: string) {
    const url = this.urlBase + '/account/login';
    const data = {
      username: username,
      password: password
    };

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }


  logout() {
    const url = this.urlBase + '/account/logout';

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }


  changePassword(data: ChangePasswordData) {
    const url = this.urlBase + '/account/change-password';

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }


  postAnswers(quizId:number, answers: Answers) {
    const url = this.urlBase + '/quiz/answer/' + quizId;
    
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(answers)
    });
  }


  getQuizes() {
    const url = this.urlBase + '/quiz';
    
    return fetch(url, {
      credentials: 'include'
    });
  }


  getQuiz(quizId: number) {
    const url = this.urlBase + '/quiz/' + quizId;

    return fetch(url, {
      credentials: 'include'
    });
  }


  getQuizResult(quizId: number) {
    const url = this.urlBase + '/quiz/result/' + quizId;

    return fetch(url, {
      credentials: 'include'
    });
  }


  getUserInfo() {
    const url = this.urlBase + '/account/user-info';

    return fetch(url, {
      credentials: 'include'
    });
  }

}