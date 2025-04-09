"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilmById = exports.getAllFilms = exports.createFilm = void 0;
const film_model_1 = __importDefault(require("../models/film.model"));

const createFilm = async (req, res, next) => { 
    try {
        const film = await film_model_1.default.create(req.body);
        res.status(201).json(film);
    }
    catch (error) {
        next(error);
    }
};
exports.createFilm = createFilm; 
const getAllFilms = async (_req, res, next) => {
    try {
        const films = await film_model_1.default.findAll();
        res.status(200).json(films);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllFilms = getAllFilms; 
const getFilmById = async (req, res, next) => {
    try {
        const film = await film_model_1.default.findByPk(req.params.filmId);
        if (!film) {
            res.status(404).json({ message: "Film not found" });
            return;
        }
        res.status(200).json(film);
    }
    catch (error) {
        next(error);
    }
};
exports.getFilmById = getFilmById;