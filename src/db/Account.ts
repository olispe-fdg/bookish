import { DataTypes } from "sequelize";
import db from "./db";

export const Account = db.define(
    "Account",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "account",
        timestamps: false,
    }
);

console.log(Account === db.models.Account);
