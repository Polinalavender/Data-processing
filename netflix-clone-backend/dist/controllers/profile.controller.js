"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.deleteProfile = exports.getProfilesByUser = exports.createProfile = void 0;
const profile_model_1 = __importDefault(require("../models/profile.model"));
const createProfile = async (req, res, next) => {
    try {
        const { userId, name, age, language, preferences, photoUrl } = req.body;
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
            photoUrl: photoUrl || '',
        });
        res.status(201).json(profile);
    }
    catch (error) {
        console.error('Create Profile Error:', error);
        next(error);
    }
};
exports.createProfile = createProfile;
const getProfilesByUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const profiles = await profile_model_1.default.findAll({
            where: { userId },
            raw: true,
        });
        if (profiles.length === 0) {
            res.status(404).json({ message: "No profiles found for this user" });
            return;
        }
        res.status(200).json(profiles);
    }
    catch (error) {
        console.error('Get Profiles Error:', error);
        next(error);
    }
};
exports.getProfilesByUser = getProfilesByUser;
const deleteProfile = async (req, res, next) => {
    try {
        const profileId = parseInt(req.params.profileId, 10);
        const deleted = await profile_model_1.default.destroy({
            where: { profileId },
        });
        if (!deleted) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        res.status(200).json({ message: "Profile deleted" });
    }
    catch (error) {
        console.error('Delete Profile Error:', error);
        next(error);
    }
};
exports.deleteProfile = deleteProfile;
const updateProfile = async (req, res, next) => {
    try {
        const profileId = parseInt(req.params.profileId, 10);
        const { name, age, language, preferences, photoUrl } = req.body;
        const profile = await profile_model_1.default.findByPk(profileId);
        if (!profile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        const updatedProfile = await profile.update({
            name,
            age,
            language: language || 'en',
            preferences: preferences || '',
            photoUrl: photoUrl || profile.photoUrl
        });
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        console.error('Update Profile Error:', error);
        next(error);
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=profile.controller.js.map