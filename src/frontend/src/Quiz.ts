// Klasa Quiz zapewnia wszystkie funkcjonalności potrzebne do przeprowadzenia
// quizu (zmiana pytania, odpowiadanie na pytania, mierzenie czasu itp.)

// Interferjsy QuizResult i QuestionResult definiują format, w jakim
// wyniki quizu będą zapisywane w localStorage.


import { QuizData } from "./deserialize.js";

export interface QuestionResult {
  content: string,
  answer: number,
  penalty: number,
  userAnswer: number,
  time: number,
  isCorrect: boolean
}

export interface QuizResult {
  name: string,
  intro: string,
  correctCount: number,
  questionCount: number,
  totalTime: number,
  totalPenalty: number,
  finalTime: number,
  statistics: QuestionResult[]
}

export type Answers = {
  id: number,
  answer: number,
  time: number
}[];


export class Quiz {
  private current = 0;
  private answered = 0;
  private started: boolean = false;
  private finished: boolean = false;
  private checkpoint: number = 0;
  private questionTimes: number[];

  constructor(private quizData: QuizData) {
    this.questionTimes = new Array<number>(this.questionCount());
    for (let i=0; i < this.questionCount(); i++) this.questionTimes[i] = 0;
  }


  getQuizData() {
    return this.quizData;
  }


  isStarted() {
    return this.started;
  }


  isFinished() {
    return this.finished;
  }


  currentQuestion() {
    return this.quizData.questions[this.current];
  }


  currentIndex() {
    return this.current;
  }


  questionCount() {
    return this.quizData.questions.length;
  }


  start() {
    if (this.started) throw new Error('Quiz can be started once');
    this.checkpoint = new Date().getTime();
    this.started = true;
  }


  finish() {
    if (!this.allAnswered()) throw new Error('Not all questions are answered');
    if (this.finished) throw new Error('Quiz can be finished once');
    this.updateCurrentQuestionTime();
    this.finished = true;
  }


  private updateCurrentQuestionTime() {
    const newCheckpoint = new Date().getTime();
    this.questionTimes[this.current] += newCheckpoint - this.checkpoint;
    this.checkpoint = newCheckpoint;
  }
  

  answerQuestion(answer: number) {
    if (!this.started || this.finished) {
      throw new Error('Questions can be answered only when quiz is active');
    }

    if (!this.currentQuestion().isAnswered()) {
      this.answered++;
    }

    this.currentQuestion().answer(answer);
  }


  forgetAnswer() {
    if (!this.started || this.finished) {
      throw new Error('Answers can be forgotten only when quiz is active');
    }
    
    if (this.currentQuestion().isAnswered()) {
      this.answered--;
    }

    this.currentQuestion().forget();
  }


  previous() {
    if (!this.started || this.finished) {
      throw new Error('Question can be changed only when quiz is active');
    }
    
    this.updateCurrentQuestionTime();
    this.current = Math.max(this.current - 1, 0);
  }


  next() {
    if (!this.started || this.finished) {
      throw new Error('Question can be changed only when quiz is active');
    }
    
    this.updateCurrentQuestionTime();
    this.current = Math.min(this.current + 1, this.questionCount() - 1);
  }


  isFirst() {
    return this.current === 0;
  }


  isLast() {
    return this.current === this.questionCount() - 1;
  }


  allAnswered(): boolean {
    return this.answered === this.questionCount();
  }


  getAnswers(): Answers {
    if (!this.finished) throw new Error('Quiz must be finished to get answers');
    
    const answers: Answers = [];

    let i = 0;
    for (const question of this.quizData.questions) {
      answers.push({
        id: question.getId(),
        answer: question.getUserAnswer(),
        time: this.questionTimes[i]
      });

      i++;
    }

    return answers;
  }


}