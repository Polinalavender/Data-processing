import { DataTypes, Model, Sequelize } from "sequelize";
import {
  IWatchlistAttributes,
  IWatchlistCreationAttributes,
} from "../interfaces/watchlist.interface";

class Watchlist
  extends Model<IWatchlistAttributes, IWatchlistCreationAttributes>
  implements IWatchlistAttributes
{
  declare watchlistId: number;
  declare profileId: number;
  declare filmId: number;
  declare addedAt: Date;
}

// ✅ Named export for model initialization
export const initWatchlistModel = (sequelize: Sequelize): void => {
  Watchlist.init(
    {
      watchlistId: {
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
      addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      tableName: "watchlists",
    }
  );
};

export default Watchlist;
