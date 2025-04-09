"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

// Import required modules using CommonJS/ES module interop
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = require("./routes/user.route");// Import custom route modules
const auth_route_1 = require("./routes/auth.route");
const profile_route_1 = require("./routes/profile.route");
const film_route_1 = require("./routes/film.route");
const watchhistory_route_1 = require("./routes/watchhistory.route");
const watchlist_route_1 = require("./routes/watchlist.route");
const subscription_route_1 = require("./routes/subscription.route");
dotenv_1.default.config(); // Load environment variables from .env file into process.env
const app = (0, express_1.default)();
const corsOptions = { // Define CORS configuration to allow requests from the frontend
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
// Mount route handlers to specific API endpoints
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json()); //For Content-Type of application/json
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use("/api/users", user_route_1.userRouter);
app.use("/api/auth", auth_route_1.authRouter);
app.use("/api/profiles", profile_route_1.profileRouter);
app.use("/api/films", film_route_1.filmRouter);
app.use("/api/watch-history", watchhistory_route_1.watchHistoryRouter);
app.use("/api/watchlist", watchlist_route_1.watchlistRouter);
app.use("/api/subscription", subscription_route_1.subscriptionRouter);
exports.default = app;