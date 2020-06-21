import { Component } from './Component.js';
import { UserData } from '../models.js';
import { Loader } from '../Loader.js';
import { HttpService } from '../HttpService.js';


export class UserbarComponent extends Component {
  private element: HTMLDivElement;

  constructor(private loader: Loader, private httpService: HttpService, private userData: UserData) {
    super();
    this.element = document.createElement('div');
    this.element.innerHTML = this.template();

    const username = 
      this.element.querySelector('#' + this.id('username')) as HTMLSpanElement;
    const quizesButton = 
      this.element.querySelector('#' + this.id('quizes')) as HTMLButtonElement;
    const changePasswordButton = 
      this.element.querySelector('#' + this.id('change-password')) as HTMLButtonElement;
    const logoutButton = 
      this.element.querySelector('#' + this.id('logout')) as HTMLButtonElement;
    
    username.innerHTML = userData.username;

    quizesButton.addEventListener('click', () => {
      this.loader.loadQuizStartComponent();
    });

    changePasswordButton.addEventListener('click', () => {
      this.loader.loadChangePasswordComponent();
    });

    logoutButton.addEventListener('click', async () => {
      const response = await this.httpService.logout();

      switch (response.status) {
        case 200:
          this.loader.loadLoginComponent();
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
    return '__userbar_component__';
  }

  getElement() {
    return this.element;
  }
  
  private template() {
    return `
      <div class="userbar">
        <span class="welcome">
          Welcome, <span class="font-weight-bold ml-1" id="${this.id('username')}"></span>
        </span>

        <button id="${this.id('quizes')}" class="ml-5 text-white btn btn-link">Quizes</span>
        <button id="${this.id('change-password')}" class="ml-3 text-white btn btn-link">Change password</span>
        <button id="${this.id('logout')}" class="ml-3 text-white btn btn-link">Logout</span>
      </div>
    `;
  }
}