import { DataTypes } from "sequelize";
import db from "./db";

export const Account = db.define(
    "Account",
    {
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
    }
);

console.log(Account === db.models.Account);
