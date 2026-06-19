export interface Genre {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GenreBasicResponse = Pick<Genre, "id" | "name">;

export type GenreCreateRequest = Pick<Genre, "name">;

export type GenreCreateResponse = Omit<Genre, "updatedAt">;

export type GenreFilter = Partial<GenreCreateRequest>;

export type GenreInfoResponse = Genre;

export type GenreUpdateRequest = GenreCreateRequest;
