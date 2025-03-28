"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../controllers/profile.controller");
const router = express_1.default.Router();
router.post("/", profile_controller_1.createProfile); // Create new profile
router.get("/:userId", profile_controller_1.getProfilesByUser); // Get profiles for a user
router.delete("/:profileId", profile_controller_1.deleteProfile); // Delete profile
router.put("/:profileId", profile_controller_1.updateProfile); // Update profile (fixed route)
exports.profileRouter = router;
//# sourceMappingURL=profile.route.js.map