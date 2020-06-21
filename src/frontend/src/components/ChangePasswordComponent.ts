import { Component } from './Component.js';
import { HttpService, ChangePasswordData } from '../HttpService.js';
import { Loader } from '../Loader.js';


export class ChangePasswordComponent extends Component {
  private element: HTMLDivElement;

  constructor(private loader: Loader, private httpService: HttpService) {
    super();
    this.element = document.createElement('div');
    this.element.className = 'container text-white radius-container';
    this.element.innerHTML = this.template();

    const newPassword =
      this.element.querySelector('#' + this.id('new-password')) as HTMLInputElement;
    const repeatPassword =
      this.element.querySelector('#' + this.id('repeat-password')) as HTMLInputElement;
    const changePasswordButton =
      this.element.querySelector('#' + this.id('change-password')) as HTMLButtonElement;
    
    
    changePasswordButton.addEventListener('click', async () => {
      const data: ChangePasswordData = {
        new_password: newPassword.value,
        repeat_password: repeatPassword.value
      };

      const response = await this.httpService.changePassword(data);

      switch (response.status) {
        case 200:
          this.loader.alertSuccess('Password succesfully changed.');
          break;
        case 401:
          this.loader.loadLoginComponent();
          break;
        case 400:
          this.loader.alertWarning((await response.json()).result);
          break;
        default:
          this.loader.alertDanger('Sorry, an error occured.');
          break;
      }
    });
  }


  getClassName() {
    return '__change_password_component__';
  }

  getElement() {
    return this.element;
  }
  
  private template() {
    return `
      <input type="password" class="form-control" placeholder="New password" id="${this.id('new-password')}">
      <br>
      <input type="password" class="form-control" placeholder="Repeat new password" id="${this.id('repeat-password')}">
      <br>
      <button class="btn btn-primary w-100" id="${this.id('change-password')}">
        Change password
      </button>
    `;
  }
}