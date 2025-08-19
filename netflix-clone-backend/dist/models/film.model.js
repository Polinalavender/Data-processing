"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFilmModel = void 0;
const sequelize_1 = require("sequelize");
class Film extends sequelize_1.Model {
}
const initFilmModel = (sequelize) => {
    Film.init({
        filmId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        classification: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        quality: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        genre: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        releaseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        ageLimit: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "films",
    });
};
exports.initFilmModel = initFilmModel;
exports.default = Film;
//# sourceMappingURL=film.model.js.map