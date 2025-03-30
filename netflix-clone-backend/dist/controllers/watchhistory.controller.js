"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryByProfile = exports.trackWatch = void 0;
const watchhistory_model_1 = __importDefault(require("../models/watchhistory.model"));
// Add or update watch history
const trackWatch = async (req, res, next) => {
    try {
        const { profileId, filmId } = req.body;
        const existing = await watchhistory_model_1.default.findOne({ where: { profileId, filmId } });
        if (existing) {
            existing.watchCount += 1;
            existing.lastWatchedAt = new Date();
            await existing.save();
            res.status(200).json(existing);
        }
        else {
            const newHistory = await watchhistory_model_1.default.create({ profileId, filmId, watchCount: 1 });
            res.status(201).json(newHistory);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.trackWatch = trackWatch;
// Get watch history by profile
const getHistoryByProfile = async (req, res, next) => {
    try {
        const history = await watchhistory_model_1.default.findAll({ where: { profileId: req.params.profileId } });
        res.status(200).json(history);
    }
    catch (error) {
        next(error);
    }
};
exports.getHistoryByProfile = getHistoryByProfile;