"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProfileModel = void 0;
const sequelize_1 = require("sequelize");
class Profile extends sequelize_1.Model {
}
const initProfileModel = (sequelizeInstance) => {
    Profile.init({
        profileId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        language: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: "en",
        },
        preferences: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        photoUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize: sequelizeInstance,
        tableName: "profiles",
    });
};
exports.initProfileModel = initProfileModel;
exports.default = Profile;