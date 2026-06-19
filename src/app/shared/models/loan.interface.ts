import { LoanStatus } from "@/shared/enums/loan-status";
import { Book, BookBasicResponse } from "@/shared/models/books.interface";
import { User, UserBasicResponse } from "@/shared/models/user.interface";

export interface Loan {
  id: number;
  user: User;
  book: Book;
  status: LoanStatus;
  renewed: boolean;
  borrowedAt: Date;
  dueAt: Date;
  returnedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanCreateRequest {
  userId: number;
  bookId: number;
  borrowedAt: Date;
}

export interface LoanCreateResponse {
  id: number;
  user: UserBasicResponse;
  book: BookBasicResponse;
  status: LoanStatus;
  borrowedAt: Date;
  dueAt: Date;
  createdAt: Date;
}

export interface LoanFilter {
  userId?: number;
  bookId?: number;
  status?: LoanStatus;
  renewed?: boolean;
  borrowedAt?: Date;
  dueAt?: Date;
  returnedAt?: Date | null;
}

export interface LoanHistoryResponse {
  id: number;
  book: BookBasicResponse;
  status: LoanStatus;
  renewed: boolean;
  borrowedAt: Date;
  dueAt: Date;
  returnedAt: Date | null;
}

export interface LoanInfoResponse {
  id: number;
  user: UserBasicResponse;
  book: BookBasicResponse;
  status: LoanStatus;
  renewed: boolean;
  borrowedAt: Date;
  dueAt: Date;
  returnedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type LoanReturnRequest = Pick<Loan, "returnedAt">;
