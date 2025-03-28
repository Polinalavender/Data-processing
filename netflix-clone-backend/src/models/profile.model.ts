import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database/initialize-database.config";
import { IProfileAttributes, IProfileCreationAttributes } from "../interfaces/profile.interface";

class Profile extends Model<IProfileAttributes, IProfileCreationAttributes> implements IProfileAttributes {
  declare profileId: number;
  declare userId: number;
  declare name: string;
  declare age: number;
  declare language: string;
  declare preferences: string;
  declare photoUrl: string;
}

export const initProfileModel = (sequelizeInstance: any): void => {
  Profile.init(
    {
      profileId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        defaultValue: "en",
      },
      preferences: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },      
    },
    {
      sequelize: sequelizeInstance,
      tableName: "profiles",
    }
  );
};

export default Profile;