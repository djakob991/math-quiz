
export class Question {
  private userAnswer: number = 0;
  private answered = false;

  constructor(
    private id: number,
    private content: string,
    private penalty: number
  ) {}

  
  getId() {
    return this.id;
  }


  getContent() {
    return this.content;
  }


  getPenalty() {
    return this.penalty;
  }


  getUserAnswer() {
    if (!this.isAnswered()) {
      throw new Error('Question is not answered');
    }

    return this.userAnswer;
  }

  
  isAnswered() {
    return this.answered;
  }


  answer(userAnswer: number) {
    this.answered = true;
    this.userAnswer = userAnswer;
  }


  forget() {
    this.answered = false;
  }

}