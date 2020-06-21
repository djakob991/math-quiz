
import { Loader } from "./Loader.js";
import { HttpService } from "./HttpService.js";


// W divie o id "root" będzie ładowany aktualny widok aplikacji
// Widoki są zdefiniowane w komponentach.

const userbarRoot = document.querySelector('#userbar') as HTMLDivElement;
const alertRoot = document.querySelector('#alert') as HTMLDivElement;
const contentRoot = document.querySelector('#root') as HTMLDivElement;

const httpService = new HttpService();
const loader = new Loader(contentRoot, userbarRoot, alertRoot, httpService);

loader.init();

 










