import express from "express";
import {
  createFilm,
  getAllFilms,
  getFilmById,
} from "../controllers/film.controller";

const router = express.Router();

router.post("/", createFilm); // Add a new film
router.get("/", getAllFilms); // List all films
router.get("/:filmId", getFilmById); // Get a film by ID

export const filmRouter = router;
