// Komponent odpowiadający fragmentowi strony, na którym są wyświetlane
// dane o zakończonym quizie (komponent ten jest użyty w QuizEndComponent oraz
// QuizMemoryComponent)


import { Component } from "./Component.js";
import { QuizResult } from "../Quiz.js";


export class QuizStatsComponent extends Component {
  private element: HTMLDivElement;

  constructor(private result: QuizResult) {
    super();
    this.element = document.createElement('div');
    this.element.className = 'container text-white';
    this.element.innerHTML = this.template();

    const name = this.element.querySelector('#' + this.id('name')) as HTMLElement;
    const intro = this.element.querySelector('#' + this.id('intro')) as HTMLElement;
    const time = this.element.querySelector('#' + this.id('time')) as HTMLDivElement;
    const score = this.element.querySelector('#' + this.id('score')) as HTMLDivElement;

    name.innerHTML = result.name;
    intro.innerHTML = result.intro;

    time.innerHTML = `
      <span class="text-lightgray">Your time:</span> 
      <b>
        ${(result.finalTime / 1000).toFixed(2)} (${(result.totalTime / 1000).toFixed(2)} 
        <span class="text-danger">+ ${result.totalPenalty}</span>)
      </b>
    `;

    score.innerHTML =  `
      <span class="text-lightgray">Your score:</span>
      <b>${result.correctCount}/${result.questionCount}</b>
    `;

    if (result.statistics.length === 0) {
      const noDetails = document.createElement('h5');
      noDetails.innerHTML = `
        Detailed statistics for this quiz have not been saved
      `;
      this.element.appendChild(noDetails);

    } else {
      const table = document.createElement('table');
      const thead = table.createTHead();
      const tbody = table.createTBody();
      
      table.className = 'table quiz-results-table';
      thead.innerHTML = `
        <tr style="border-top: hidden">
          <th>Question</th>
          <th>Your answer</th>
          <th>Correct answer</th>
          <th>Your time</th>
          <th>Penalty</th>
        </tr>
      `;

      for (const item of result.statistics) {
        const row = tbody.insertRow();
        row.className = item.isCorrect ? 'bg-success' : 'bg-danger';
  
        row.insertCell().innerHTML = item.content;
        row.insertCell().innerHTML = `${item.userAnswer}`;
        row.insertCell().innerHTML = `${item.answer}`;
        row.insertCell().innerHTML = `${(item.time / 1000).toFixed(2)}`;
        row.insertCell().innerHTML = item.isCorrect ? '' : `+${item.penalty}`;
      }

      this.element.appendChild(table);
    }
  }

  getClassName() {
    return '__quiz_stats_component__';
  }

  getElement() {
    return this.element;
  }
  
  private template() {
    return `
      <div class="row align-items-center">
        <div class="col-sm-6">
          <h1 id="${this.id('name')}"></h1>
          <h3 id="${this.id('intro')}"></h3>
        </div>
      </div>
      <hr>

      <div id="${this.id('score')}" class="quiz-result-item"></div>
      <div id="${this.id('time')}" class="quiz-result-item mb-3"></div>
    `;
  }
}