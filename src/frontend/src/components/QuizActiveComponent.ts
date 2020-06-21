// Komponent odpowiadający widokowi aktywnego quizu.


import { Component } from "./Component.js";
import { Loader } from "../Loader.js";
import { Quiz } from "../Quiz.js";
import { HttpService } from "../HttpService.js";


export class QuizActiveComponent extends Component {
  private element: HTMLDivElement;

  constructor(private loader: Loader, private httpService: HttpService, private quiz: Quiz) {
    super();
    this.element = document.createElement('div');
    this.element.innerHTML = this.template();

    const error = 
      this.element.querySelector('#' + this.id('error')) as HTMLDivElement;
    const timer = 
      this.element.querySelector('#' + this.id('timer')) as HTMLElement;
    const intro = 
      this.element.querySelector('#' + this.id('intro')) as HTMLElement;
    const name = 
      this.element.querySelector('#' + this.id('name')) as HTMLElement;
    const questionNumber = 
      this.element.querySelector('#' + this.id('question-number')) as HTMLElement;
    const questionPenalty = 
      this.element.querySelector('#' + this.id('question-penalty')) as HTMLElement;
    const content = 
      this.element.querySelector('#' + this.id('content')) as HTMLElement;
    const answer = 
      this.element.querySelector('#' + this.id('answer')) as HTMLInputElement;
    const previousButton = 
      this.element.querySelector('#' + this.id('previous')) as HTMLButtonElement;
    const nextButton = 
      this.element.querySelector('#' + this.id('next')) as HTMLButtonElement;
    const cancelButton = 
      this.element.querySelector('#' + this.id('cancel')) as HTMLButtonElement;
    const finishButton = 
      this.element.querySelector('#' + this.id('finish')) as HTMLButtonElement;

    name.innerHTML = quiz.getQuizData().name;
    intro.innerHTML = quiz.getQuizData().intro;
    finishButton.disabled = true;

    const updateDisplayedData = () => {
      error.hidden = true;
      const question = quiz.currentQuestion();
      
      const questionNumberContent = `
        question <b>${quiz.currentIndex() + 1}/${quiz.questionCount()}</b>
      `;
      const questionPenaltyContent = `
        penalty <b>${question.getPenalty()}s</b>
      `;
      questionNumber.innerHTML = questionNumberContent;
      questionPenalty.innerHTML = questionPenaltyContent;
      content.innerHTML =  question.getContent() + ' = ';
      
      answer.value = question.isAnswered() ? String(question.getUserAnswer()) : '';
      previousButton.disabled = quiz.isFirst();
      nextButton.disabled = quiz.isLast();
    }

    
    updateDisplayedData();
    quiz.start();

    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      timer.innerHTML = seconds + ' s';
    }, 1000);

    
    answer.addEventListener('input', () => {
      error.hidden = true;
    
      if (answer.value === '') {
        quiz.forgetAnswer();
      
      } else {
        const value: number = Number(answer.value);
      
        if (!isNaN(value)) {
          quiz.answerQuestion(value);
        } else {
          quiz.forgetAnswer();
          error.hidden = false;
        }
      }
    
      finishButton.disabled = !quiz.allAnswered();
    });


    previousButton.addEventListener('click', () => {
      quiz.previous();
      updateDisplayedData();
    });
    
    
    nextButton.addEventListener('click', () => {
      quiz.next();
      updateDisplayedData();
    });


    cancelButton.addEventListener('click', () => {
      clearInterval(interval);
      this.loader.loadQuizStartComponent();
    });


    finishButton.addEventListener('click', async () => {
      clearInterval(interval);
      quiz.finish();
      
      const id = this.quiz.getQuizData().id;
      const answers = this.quiz.getAnswers();
      const response = await this.httpService.postAnswers(id, answers);

      switch (response.status) {
        case 200:
          this.loader.loadQuizMemoryComponent(id);
          break;
        case 401:
          this.loader.loadLoginComponent();
          break;
        default:
          break;
      }
    });


  }

  getClassName() {
    return '__quiz_active_component__';
  }

  getElement() {
    return this.element;
  }

  private template() {
    return `
      <div class="container text-white">
        <div class="row align-items-center">
          <div class="col-sm-6">
            <h1 id="${this.id('name')}"></h1>
            <h3 id="${this.id('intro')}"></h3>
          </div>
          <div class="col-sm-6 text-right timer" id="${this.id('timer')}">0 s</div>
        </div>
        <hr>
    
        <span id="${this.id('question-number')}" class="mr-5"></span>
        <span id="${this.id('question-penalty')}"></span>

        <div class="d-flex flex-wrap mb-5">
          <span id="${this.id('content')}" class="question-content"></span>
          <input id="${this.id('answer')}" class="answer-input"></input>
        </div>

        <div class="row">
          <div class="col-sm-3 pl-2 pr-2 mt-1 mb-1">
            <button class="btn btn-secondary w-100" id="${this.id('previous')}">Previous</button>
          </div>

          <div class="col-sm-3 pl-2 pr-2 mt-1 mb-1">
            <button class="btn btn-secondary w-100" id="${this.id('next')}">Next</button>
          </div>

          <div class="col-sm-3 pl-2 pr-2 mt-1 mb-1">
            <button class="btn btn-secondary w-100" id="${this.id('cancel')}">Cancel</button>
          </div>

          <div class="col-sm-3 pl-2 pr-2 mt-1 mb-1">
            <button class="btn btn-secondary w-100" id="${this.id('finish')}">Finish</button>
          </div>
        </div>

        <div class="text-danger font-weight-bold" id="${this.id('error')}">Answer must be an integer!</div>
      </div>
    `;
  }
}
