import { Book } from "@/features/books/models/books.interface";
import { Genre } from "@/features/genres/models/genre.interface";

export interface BookGenre {
  id: number;
  book: Book;
  genre: Genre;
  createdAt: Date;
  updatedAt: Date;
}
