"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filmRouter = void 0;
const express_1 = __importDefault(require("express"));
const film_controller_1 = require("../controllers/film.controller");
const router = express_1.default.Router();
router.post("/", film_controller_1.createFilm); // Add a new film
router.get("/", film_controller_1.getAllFilms); // List all films
router.get("/:filmId", film_controller_1.getFilmById); // Get a film by ID
exports.filmRouter = router;
//# sourceMappingURL=film.route.js.map