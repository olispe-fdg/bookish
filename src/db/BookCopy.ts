import { DataTypes } from "sequelize";
import db from "./db";

export const BookCopy = db.define(
    "BookCopy",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
    },
    { tableName: "book_copy", timestamps: false }
);

console.log(BookCopy === db.models.BookCopy);
