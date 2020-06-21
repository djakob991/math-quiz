// Klasa Loader odpowiada za tworzenie i ładowanie odpowiednich komponentów
// do przekazanego w konstruktorze rodzica. Przechowuje instancje odpowiednich
// klas (storage, service) i wstrzykuje je komponentom.

import { HttpService, QuizBrieaf } from "./HttpService.js";
import { Quiz, QuizResult } from "./Quiz.js";

import { LoginComponent } from "./components/LoginComponent.js";
import { QuizStartComponent } from "./components/QuizStartComponent.js";
import { QuizActiveComponent } from "./components/QuizActiveComponent.js";
import { QuizMemoryComponent } from "./components/QuizMemoryComponent.js";
import { ChangePasswordComponent } from "./components/ChangePasswordComponent.js";
import { QuizData, deserialize } from "./deserialize.js";
import { UserData } from "./models.js";
import { UserbarComponent } from "./components/UserbarComponent.js";


export class Loader {
  constructor(
    private contentParent: HTMLElement,
    private userbarParent: HTMLDivElement,
    private alertParent: HTMLDivElement,
    private httpService: HttpService
  ) {}


  private load(child: HTMLElement) {
    this.contentParent.innerHTML = '';
    this.contentParent.appendChild(child);
  }


  private loadUserbar(userData: UserData) {
    const userbarComponent = new UserbarComponent(this, this.httpService, userData);
    this.userbarParent.innerHTML = '';
    this.userbarParent.appendChild(userbarComponent.getElement());
  }


  private clearUserbar() {
    this.userbarParent.innerHTML = '';
  }


  async init() {
    const response = await this.httpService.getUserInfo();

    switch (response.status) {
      case 200:
        const userData: UserData = (await response.json()).user;
        this.loadUserbar(userData);
        this.loadQuizStartComponent();
        break;
      case 401:
        this.loadLoginComponent();
      default:
        break;
    }
  }


  loadLoginComponent() {
    this.alertClear();
    this.clearUserbar();
    const loginComponent = new LoginComponent(this, this.httpService);
    this.load(loginComponent.getElement());
  }


  async loadQuizStartComponent() {
    this.alertClear();
    const response = await this.httpService.getQuizes();
    
    switch (response.status) {
      case 200:
        const quizes: QuizBrieaf[] = await response.json();
        const quizStartComponent = new QuizStartComponent(this, this.httpService, quizes);
        this.load(quizStartComponent.getElement());
        break;
      case 401:
        this.loadLoginComponent();
      default:
        break;
    }
  }


  async loadQuizActiveComponent(quizId: number) {
    this.alertClear();
    const response = await this.httpService.getQuiz(quizId);

    switch (response.status) {
      case 200:
        const jsonString = await response.text();
        const quizData: QuizData = deserialize(jsonString);
        const quiz = new Quiz(quizData);

        const quizActiveComponent = new QuizActiveComponent(this, this.httpService, quiz);
        this.load(quizActiveComponent.getElement());
        break;
      case 401:
        this.loadLoginComponent();
        break;
      default:
        break;
    }
  }


  async loadQuizMemoryComponent(quizId: number) {
    this.alertClear();
    const response = await this.httpService.getQuizResult(quizId);
    
    switch (response.status) {
      case 200:
        const result: QuizResult = await response.json();
        const quizMemoryComponent = new QuizMemoryComponent(this, this.httpService, result);
        this.load(quizMemoryComponent.getElement());
        break;
      case 401:
        this.loadLoginComponent();
        break;
      default:
        break;
    }
  }


  loadChangePasswordComponent() {
    this.alertClear();
    const changePasswordComponent = new ChangePasswordComponent(this, this.httpService);
    this.load(changePasswordComponent.getElement());
  }


  alertDanger(message: string) {
    this.alertParent.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        ${message}
      </div>
    `;
  }

  alertWarning(message: string) {
    this.alertParent.innerHTML = `
      <div class="alert alert-warning alert-dismissible">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        ${message}
      </div>
    `;
  }

  alertSuccess(message: string) {
    this.alertParent.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        ${message}
      </div>
    `;
  }

  alertClear() {
    this.alertParent.innerHTML = '';
  }

}