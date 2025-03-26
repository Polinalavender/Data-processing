"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.getProfilesByUser = exports.createProfile = void 0;
const profile_model_1 = __importDefault(require("../models/profile.model"));
// Create a profile (limit to 4 per user)
const createProfile = async (req, res, next) => {
    try {
        const { userId, name, age, language, preferences, } = req.body;
        const count = await profile_model_1.default.count({ where: { userId } });
        if (count >= 4) {
            res
                .status(400)
                .json({ message: "User can have a maximum of 4 profiles." });
            return;
        }
        const profile = await profile_model_1.default.create({
            userId,
            name,
            age,
            language: language || 'en',
            preferences: preferences || '',
        });
        res.status(201).json(profile);
    }
    catch (error) {
        next(error);
    }
};
exports.createProfile = createProfile;
// Get all profiles for a user
const getProfilesByUser = async (req, res, next) => {
    try {
        const profiles = await profile_model_1.default.findAll({
            where: { userId: req.params.userId },
        });
        res.status(200).json(profiles);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfilesByUser = getProfilesByUser;
// Delete a profile
const deleteProfile = async (req, res, next) => {
    try {
        const deleted = await profile_model_1.default.destroy({
            where: { profileId: req.params.profileId },
        });
        if (!deleted) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        res.status(200).json({ message: "Profile deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProfile = deleteProfile;
//# sourceMappingURL=profile.controller.js.map