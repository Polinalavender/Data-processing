import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route";
import { authRouter } from "./routes/auth.route";
import { profileRouter } from "./routes/profile.route";
import { filmRouter } from "./routes/film.route";
import { watchHistoryRouter } from "./routes/watchhistory.route";
import { watchlistRouter } from "./routes/watchlist.route";
import { subscriptionRouter } from "./routes/subscription.route";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["https://netflix-clone.onrender.com", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
//For Content-Type of application/json
app.use(express.json());
//For Content-Type of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/films", filmRouter);
app.use("/api/watch-history", watchHistoryRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/subscription", subscriptionRouter);

export default app;
