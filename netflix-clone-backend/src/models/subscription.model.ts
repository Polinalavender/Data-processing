import { DataTypes, Model, Sequelize } from "sequelize";
import { ISubscriptionAttributes, ISubscriptionCreationAttributes } from "../interfaces/subscription.interface";

class Subscription
  extends Model<ISubscriptionAttributes, ISubscriptionCreationAttributes>
  implements ISubscriptionAttributes {
  declare subscriptionId: number;
  declare userId: number;
  declare plan: "FREE" | "SD" | "HD" | "UHD";
  declare startDate: Date;
  declare endDate: Date;
  declare price: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initSubscriptionModel = (sequelize: Sequelize): void => {
  Subscription.init(
    {
      subscriptionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      plan: {
        type: DataTypes.ENUM("FREE", "SD", "HD", "UHD"),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "subscriptions",
      timestamps: true,
    }
  );
};

export default Subscription;
