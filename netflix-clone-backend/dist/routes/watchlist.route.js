"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchlistRouter = void 0;
const express_1 = __importDefault(require("express"));
const watchlist_controller_1 = require("../controllers/watchlist.controller");
const router = express_1.default.Router();
router.post("/", watchlist_controller_1.addToWatchlist); 
router.get("/:profileId", watchlist_controller_1.getWatchlist); 
router.delete("/:watchlistId", watchlist_controller_1.removeFromWatchlist); 
exports.watchlistRouter = router;