import { Book } from "@/shared/models/books.interface";
import { Genre } from "@/shared/models/genre.interface";

export interface BookGenre {
  id: number;
  book: Book;
  genre: Genre;
  createdAt: Date;
  updatedAt: Date;
}
