import { GenreBasicResponse } from "@/features/genres/models/genre.interface";

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  edition: number;
  isbn: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookCreateRequest {
  title: string;
  author: string;
  publisher: string;
  year: number;
  edition: number;
  isbn: string;
  genreIds: number[];
}

export interface BookFilter {
  title?: string;
  author?: string;
  publisher?: string;
  year?: number;
  edition?: number;
  isbn?: string;
  genreName?: string;
}

export type BookBasicResponse = Pick<Book, "id" | "title" | "author">;

export type BookInfoResponse = Book & {
  genres: GenreBasicResponse[];
};

export type BookUpdateRequest = Partial<BookCreateRequest>;

export type BookCreateResponse = Pick<Book, "id" | "title" | "author" | "isbn" | "createdAt"> & {
  genres: GenreBasicResponse[];
};
