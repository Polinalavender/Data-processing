"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWatchlist = exports.getWatchlist = exports.addToWatchlist = void 0;
const watchlist_model_1 = __importDefault(require("../models/watchlist.model"));

const addToWatchlist = async (req, res, next) => {
    try {
        const item = await watchlist_model_1.default.create(req.body);
        res.status(201).json(item);
    }
    catch (error) {
        next(error);
    }
};
exports.addToWatchlist = addToWatchlist;

const getWatchlist = async (req, res, next) => {
    try {
        const list = await watchlist_model_1.default.findAll({ where: { profileId: req.params.profileId } });
        res.status(200).json(list);
    }
    catch (error) {
        next(error);
    }
};
exports.getWatchlist = getWatchlist;

const removeFromWatchlist = async (req, res, next) => {
    try {
        const deleted = await watchlist_model_1.default.destroy({ where: { watchlistId: req.params.watchlistId } });
        if (!deleted) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.status(200).json({ message: "Removed from watchlist" });
    }
    catch (error) {
        next(error);
    }
};
exports.removeFromWatchlist = removeFromWatchlist;