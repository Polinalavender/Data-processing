import { DataTypes, Model, Sequelize } from "sequelize";
import {
  IWatchHistoryAttributes,
  IWatchHistoryCreationAttributes,
} from "../interfaces/watchhistory.interface";

class WatchHistory
  extends Model<IWatchHistoryAttributes, IWatchHistoryCreationAttributes>
  implements IWatchHistoryAttributes
{
  declare historyId: number;
  declare profileId: number;
  declare filmId: number;
  declare watchCount: number;
  declare lastWatchedAt: Date;
}

export const initWatchHistoryModel = (sequelize: Sequelize): void => {
  WatchHistory.init(
    {
      historyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      profileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      filmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      watchCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      lastWatchedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      tableName: "watch_histories",
    }
  );
};

export default WatchHistory;