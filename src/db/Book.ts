import { DataTypes } from "sequelize";
import db from "./db";

export const Book = db.define(
    "Book",
    {},
    { tableName: "book", timestamps: false }
);

console.log(Book === db.models.Book);
