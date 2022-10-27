import { DataTypes } from "sequelize";
import db from "./db";

export const Author = db.define(
    "Author",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "author",
        timestamps: false,
    }
);

console.log(Author === db.models.Author);
