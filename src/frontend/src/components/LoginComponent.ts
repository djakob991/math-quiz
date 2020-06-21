import { Component } from "./Component.js";
import { Loader } from "../Loader.js";
import { HttpService } from "../HttpService.js";
 

export class LoginComponent extends Component {
  private element: HTMLDivElement;

  constructor(private loader: Loader, private httpService: HttpService) {
    super();
    this.element = document.createElement('div');
    this.element.className = 'container text-white radius-container';
    this.element.innerHTML = this.template();

    const username =
      this.element.querySelector('#' + this.id('username')) as HTMLInputElement;
    const password =
      this.element.querySelector('#' + this.id('password')) as HTMLInputElement;
    const loginButton =
      this.element.querySelector('#' + this.id('login')) as HTMLButtonElement;

    
    loginButton.addEventListener('click', async () => {
      const loginResponse = await this.httpService.login(username.value, password.value);
    
      switch (loginResponse.status) {
        case 200:
          this.loader.init();
          break;
        
        case 401:
          this.loader.alertWarning((await loginResponse.json()).result);
          break;

        default:
          this.loader.alertDanger('Sorry, an error occured.');
          break;
      }
    });
  }


  getClassName() {
    return '__login_component__';
  }

  getElement() {
    return this.element;
  }

  private template() {
    return `
      <input class="form-control" placeholder="Username" id="${this.id('username')}">
      <br>
      <input type="password" class="form-control" placeholder="Password" id="${this.id('password')}">
      <br>
      <button class="btn btn-success w-100" id="${this.id('login')}">
        Login
      </button>
    `;
  }
}