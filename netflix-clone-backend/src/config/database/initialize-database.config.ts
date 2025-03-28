import { Sequelize } from "sequelize";
import { databaseConfig } from "./database.config";

export const sequelize = new Sequelize(databaseConfig.database);

import User, { initUserModel } from "../../models/user.model";
import Profile, { initProfileModel } from "../../models/profile.model";
import Film, { initFilmModel } from "../../models/film.model";
import WatchHistory, { initWatchHistoryModel } from "../../models/watchhistory.model";
import Watchlist, { initWatchlistModel } from "../../models/watchlist.model";
import Subscription, { initSubscriptionModel } from "../../models/subscription.model";

export const initializeDatabase = async (): Promise<void> => {
  try {
    initUserModel(sequelize);
    initProfileModel(sequelize);
    initFilmModel(sequelize);
    initWatchHistoryModel(sequelize);
    initWatchlistModel(sequelize);
    initSubscriptionModel(sequelize);

    // User -> Profiles
    User.hasMany(Profile, { foreignKey: "userId", as: "profiles", onDelete: "CASCADE" });
    Profile.belongsTo(User, { foreignKey: "userId", as: "user" });

    // Profile -> WatchHistory
    Profile.hasMany(WatchHistory, { foreignKey: "profileId", as: "watchHistory", onDelete: "CASCADE" });
    WatchHistory.belongsTo(Profile, { foreignKey: "profileId", as: "profile" });

    // Film -> WatchHistory
    Film.hasMany(WatchHistory, { foreignKey: "filmId", as: "watchHistory", onDelete: "CASCADE" });
    WatchHistory.belongsTo(Film, { foreignKey: "filmId", as: "film" });

    // Profile -> Watchlist
    Profile.hasMany(Watchlist, { foreignKey: "profileId", as: "watchlist", onDelete: "CASCADE" });
    Watchlist.belongsTo(Profile, { foreignKey: "profileId", as: "profile" });

    // Film -> Watchlist
    Film.hasMany(Watchlist, { foreignKey: "filmId", as: "watchlistItems", onDelete: "CASCADE" });
    Watchlist.belongsTo(Film, { foreignKey: "filmId", as: "film" });

    // User -> Subscription
    User.hasOne(Subscription, { foreignKey: "userId", as: "subscription", onDelete: "CASCADE" });
    Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });

    await sequelize.authenticate();
    // await sequelize.sync();
    await sequelize.sync({ alter: true });

    console.log(`✅ Database connected and synchronized.`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};
