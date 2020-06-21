// Funkcja 'deserialize' tworzy obiekt zgodny z interfejsem QuizData 
// na podstawie jsona opisującego quiz (kluczowe jest tu tworzenie listy
// instancji klasy Question)


import { Question } from "./Question.js";

type QuestionRaw = {
  id: number,
  content: string,
  penalty: number
}


type QuizDataRaw = {
  id: number,
  name: string,
  intro: string,
  questions: QuestionRaw[]
}


export interface QuizData {
  id: number,
  name: string,
  intro: string,
  questions: Question[]
}


export const deserialize = (jsonString: string) => {
  const rawData: QuizDataRaw = JSON.parse(jsonString);
  const questions: Question[] = [];

  for (const item of rawData.questions) {
    questions.push(new Question(item.id, item.content, item.penalty));
  }

  const data: QuizData = {
    id: rawData.id,
    intro: rawData.intro,
    name: rawData.name,
    questions
  };

  return data;
}