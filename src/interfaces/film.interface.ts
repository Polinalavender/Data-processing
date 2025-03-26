export interface IFilmAttributes {
  filmId: number;
  title: string;
  description: string;
  category: string;
  releaseDate: Date;
  duration: number;
  ageLimit: string;
  classification: string;
  quality: string;
  genre: string;
}

export interface IFilmCreationAttributes {
  title: string;
  description: string;
  releaseDate: Date;
  duration: number;
  classification: string;
  quality: string;
  genre: string;
}
