import { DataTypes } from "sequelize";
import db from "./db";

export const Subject = db.define(
    "Subject",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "subject",
        timestamps: false,
    }
);

console.log(Subject === db.models.Subject);
