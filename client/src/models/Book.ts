export interface Book {
  authors: string[],
  description: string;
  bookId: string;
  image: string;
  link: string;
  title: string;
}

export interface SavedBook {
  authors: string[],
  description: string;
  bookId: string;
  image?: string;
  link?: string;
  title: string;
}