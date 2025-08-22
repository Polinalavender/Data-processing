import { Request, Response, NextFunction } from "express";
import Film from "../models/film.model";

export const createFilm = async ( // Add new film
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const film = await Film.create(req.body);
    res.status(201).json(film);
  } catch (error) {
    next(error);
  }
};

export const getAllFilms = async ( 
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const films = await Film.findAll();
    res.status(200).json(films);
  } catch (error) {
    next(error);
  }
};

export const getFilmById = async ( // Get single film
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const film = await Film.findByPk(req.params.filmId);
    if (!film) {
      res.status(404).json({ message: "Film not found" });
      return;
    }
    res.status(200).json(film);
  } catch (error) {
    next(error);
  }
};
