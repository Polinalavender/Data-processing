"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.login);
router.get("/currentUser", auth_middleware_1.default, user_controller_1.currentUser);
router.get('/:id', user_controller_1.getUserById);
exports.userRouter = router;
//# sourceMappingURL=user.route.js.map