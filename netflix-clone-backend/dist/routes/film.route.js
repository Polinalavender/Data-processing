"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filmRouter = void 0;
const express_1 = __importDefault(require("express"));
const film_controller_1 = require("../controllers/film.controller");
const router = express_1.default.Router();
router.post("/", film_controller_1.createFilm); 
router.get("/", film_controller_1.getAllFilms); 
router.get("/:filmId", film_controller_1.getFilmById); 
exports.filmRouter = router;