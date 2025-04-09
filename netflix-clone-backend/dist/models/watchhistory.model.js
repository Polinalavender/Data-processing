"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWatchHistoryModel = void 0;
const sequelize_1 = require("sequelize");
class WatchHistory extends sequelize_1.Model {
}
const initWatchHistoryModel = (sequelize) => {
    WatchHistory.init({
        historyId: {
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
        watchCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        lastWatchedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
        },
    }, {
        sequelize,
        tableName: "watch_histories",
    });
};
exports.initWatchHistoryModel = initWatchHistoryModel;
exports.default = WatchHistory;