"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("./database.config");
exports.sequelize = new sequelize_1.Sequelize(database_config_1.databaseConfig.database);
const user_model_1 = __importStar(require("../../models/user.model"));
const profile_model_1 = __importStar(require("../../models/profile.model"));
const film_model_1 = __importStar(require("../../models/film.model"));
const watchhistory_model_1 = __importStar(require("../../models/watchhistory.model"));
const watchlist_model_1 = __importStar(require("../../models/watchlist.model"));
const subscription_model_1 = __importStar(require("../../models/subscription.model"));
const initializeDatabase = async () => {
    try {
        (0, user_model_1.initUserModel)(exports.sequelize);
        (0, profile_model_1.initProfileModel)(exports.sequelize);
        (0, film_model_1.initFilmModel)(exports.sequelize);
        (0, watchhistory_model_1.initWatchHistoryModel)(exports.sequelize);
        (0, watchlist_model_1.initWatchlistModel)(exports.sequelize);
        (0, subscription_model_1.initSubscriptionModel)(exports.sequelize);
        // User -> Profiles
        user_model_1.default.hasMany(profile_model_1.default, { foreignKey: "userId", as: "profiles", onDelete: "CASCADE" });
        profile_model_1.default.belongsTo(user_model_1.default, { foreignKey: "userId", as: "user" });
        // Profile -> WatchHistory
        profile_model_1.default.hasMany(watchhistory_model_1.default, { foreignKey: "profileId", as: "watchHistory", onDelete: "CASCADE" });
        watchhistory_model_1.default.belongsTo(profile_model_1.default, { foreignKey: "profileId", as: "profile" });
        // Film -> WatchHistory
        film_model_1.default.hasMany(watchhistory_model_1.default, { foreignKey: "filmId", as: "watchHistory", onDelete: "CASCADE" });
        watchhistory_model_1.default.belongsTo(film_model_1.default, { foreignKey: "filmId", as: "film" });
        // Profile -> Watchlist
        profile_model_1.default.hasMany(watchlist_model_1.default, { foreignKey: "profileId", as: "watchlist", onDelete: "CASCADE" });
        watchlist_model_1.default.belongsTo(profile_model_1.default, { foreignKey: "profileId", as: "profile" });
        // Film -> Watchlist
        film_model_1.default.hasMany(watchlist_model_1.default, { foreignKey: "filmId", as: "watchlistItems", onDelete: "CASCADE" });
        watchlist_model_1.default.belongsTo(film_model_1.default, { foreignKey: "filmId", as: "film" });
        // User -> Subscription
        user_model_1.default.hasOne(subscription_model_1.default, { foreignKey: "userId", as: "subscription", onDelete: "CASCADE" });
        subscription_model_1.default.belongsTo(user_model_1.default, { foreignKey: "userId", as: "user" });
        await exports.sequelize.authenticate();
        await exports.sequelize.sync({ alter: true }); // await sequelize.sync();
        console.log(`✅ Database connected and synchronized.`);
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
    }
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=initialize-database.config.js.map