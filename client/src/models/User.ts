import type { Book } from './Book';

export interface User {
  username: string | null;
  email: string | null;
  password: string | null;
  savedBooks: Book[];
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}