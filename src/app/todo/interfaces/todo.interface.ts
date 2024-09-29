export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  people: Person[];
  deadline: string;
}

export interface Person {
  id: number;
  fullName: string;
  age: number;
  skills: string[];
}
