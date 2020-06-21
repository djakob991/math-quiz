// Komponent odpowiadający widokowi danych odczytanych z localStorage o
// zakończonym wcześniej quizie.


import { Component } from "./Component.js";
import { Loader } from "../Loader.js";
import { QuizResult } from "../Quiz.js";
import { QuizStatsComponent } from "./QuizStatsComponent.js";
import { HttpService } from "../HttpService.js";


export class QuizMemoryComponent extends Component {
  private element: HTMLDivElement;

  constructor(private loader: Loader, private httpService: HttpService, private result: QuizResult) {
    super();

    this.element = document.createElement('div');
    this.element.innerHTML = this.template();

    const stats = this.element.querySelector('#' + this.id('stats')) as HTMLElement;
    const main = this.element.querySelector('#' + this.id('main')) as HTMLButtonElement;

    const statsComponent = new QuizStatsComponent(this.result);
    stats.replaceWith(statsComponent.getElement());

    main.addEventListener('click', () => {
      this.loader.loadQuizStartComponent();
    });
  }

  getClassName() {
    return '__quiz_memory_component__';
  }

  getElement() {
    return this.element;
  }

  private template() {
    return `
      <div id="${this.id('stats')}"></div>

      <div class="container text-white">
        <button class="btn btn-secondary w-100" id="${this.id('main')}">
          Go to main page
        </button>
      </div>
    `;
  }
}