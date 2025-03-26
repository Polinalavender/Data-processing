"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSubscriptionModel = void 0;
const sequelize_1 = require("sequelize");
class Subscription extends sequelize_1.Model {
}
const initSubscriptionModel = (sequelize) => {
    Subscription.init({
        subscriptionId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        plan: {
            type: sequelize_1.DataTypes.ENUM("SD", "HD", "UHD"),
            allowNull: false,
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "subscriptions",
        timestamps: true,
    });
};
exports.initSubscriptionModel = initSubscriptionModel;
exports.default = Subscription;
//# sourceMappingURL=subscription.model.js.map