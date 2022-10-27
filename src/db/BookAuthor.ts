import { DataTypes } from "sequelize";
import db from "./db";

export const BookAuthor = db.define(
    "BookAuthor",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { tableName: "book_author", timestamps: false }
);

console.log(BookAuthor === db.models.BookAuthor);
