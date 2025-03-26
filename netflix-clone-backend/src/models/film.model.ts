import { DataTypes, Model, Sequelize } from "sequelize";
import { IFilmAttributes, IFilmCreationAttributes } from "../interfaces/film.interface";

class Film extends Model<IFilmAttributes, IFilmCreationAttributes> implements IFilmAttributes {
  declare filmId: number;
  declare title: string;
  declare description: string;
  declare category: string;
  declare releaseDate: Date;
  declare duration: number;
  declare ageLimit: string;
  declare classification: string;
  declare quality: string;
  declare genre: string;
}

export const initFilmModel = (sequelize: Sequelize): void => {
  Film.init(
    {
      filmId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      classification: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quality: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ageLimit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "films",
    }
  );
};

export default Film;
