import { DataTypes } from "sequelize";
import db from "./db";

export const Book = db.define(
    "Book",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        subtitle: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        cover_photo_url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        isbn: {
            type: DataTypes.INTEGER,
            unique: true,
        },
    },
    { tableName: "book", timestamps: false }
);

console.log(Book === db.models.Book);
