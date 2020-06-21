// Komponent odpowiadający widokowi strony startowej.


import { Component } from "./Component.js";
import { Loader } from "../Loader.js";
import { HttpService, QuizBrieaf } from "../HttpService.js";


export class QuizStartComponent extends Component {
  private element: HTMLDivElement;

  constructor(private loader: Loader, private httpService: HttpService, private quizes: QuizBrieaf[]) {
    super();

    this.element = document.createElement('div');
    this.element.className = 'container text-white';
    this.element.innerHTML = this.template();

    const solved: QuizBrieaf[] = [];
    const unsolved: QuizBrieaf[] = [];

    for (const quiz of quizes) {
      if (quiz.solved) {
        solved.push(quiz);
      } else {
        unsolved.push(quiz);
      }
    }

    const unsolvedLabel = document.createElement('h2');
    unsolvedLabel.innerHTML = 'Available quizes:';
    this.element.appendChild(unsolvedLabel);
    
    if (unsolved.length === 0) {
      const noUnsolved = document.createElement('h5');
      noUnsolved.innerHTML = 'There are no available quizes.';
      this.element.appendChild(noUnsolved);
    
    } else {
      const table = document.createElement('table');
      const thead = table.createTHead();
      const tbody = table.createTBody();

      table.className = 'table table-dark';
      thead.innerHTML = `
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Intro</th>
          <th></th>
        </tr>
      `;

      for (const quiz of unsolved) {
        const row = tbody.insertRow();
  
        row.insertCell().innerHTML = `${quiz.id}`;
        row.insertCell().innerHTML = quiz.name;
        row.insertCell().innerHTML = quiz.intro;
        const takeQuizCell = row.insertCell();
        
        const takeQuizButton = document.createElement('button');
        takeQuizButton.className = 'btn btn-secondary w-100';
        takeQuizButton.innerHTML = 'Take quiz';
        takeQuizButton.addEventListener('click', () => {
          this.loader.loadQuizActiveComponent(quiz.id);
        });
  
        takeQuizCell.appendChild(takeQuizButton);
      }

      this.element.appendChild(table);
    }


    const solvedLabel = document.createElement('h2');
    solvedLabel.innerHTML = 'Solved quizes:';
    this.element.appendChild(solvedLabel);
    
    if (solved.length === 0) {
      const noSolved = document.createElement('h5');
      noSolved.innerHTML = 'You have not solved any quizes yet.';
      this.element.appendChild(noSolved);
    
    } else {
      const table = document.createElement('table');
      const thead = table.createTHead();
      const tbody = table.createTBody();

      table.className = 'table table-dark';
      thead.innerHTML = `
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Intro</th>
          <th></th>
        </tr>
      `;

      for (const quiz of solved) {
        const row = tbody.insertRow();
  
        row.insertCell().innerHTML = `${quiz.id}`;
        row.insertCell().innerHTML = quiz.name;
        row.insertCell().innerHTML = quiz.intro;
        const quizMemoryCell = row.insertCell();
        
        const quizMemoryButton = document.createElement('button');
        quizMemoryButton.className = 'btn btn-secondary w-100';
        quizMemoryButton.innerHTML = 'View stats';
        quizMemoryButton.addEventListener('click', () => {
          this.loader.loadQuizMemoryComponent(quiz.id);
        });
  
        quizMemoryCell.appendChild(quizMemoryButton);
      }

      this.element.appendChild(table);
    }

    
  }

  getClassName() {
    return '__quiz_start_component__';
  }

  getElement() {
    return this.element;
  }

  private template() {
    return `
      <h1 class="mb-4 text-center">On this page you can solve a math quiz.</h1>
    `;
  }
}