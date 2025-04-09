"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWatchlistModel = void 0;
const sequelize_1 = require("sequelize");
class Watchlist extends sequelize_1.Model {
}
// ✅ Named export for model initialization
const initWatchlistModel = (sequelize) => {
    Watchlist.init({
        watchlistId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        profileId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        filmId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        addedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
        },
    }, {
        sequelize,
        tableName: "watchlists",
    });
};
exports.initWatchlistModel = initWatchlistModel;
exports.default = Watchlist;