import { DataTypes } from "sequelize";
import { BookCopy } from "./BookCopy";
import db from "./db";
import "./BookAuthor";
import { BookAuthor } from "./BookAuthor";
import { Author } from "./Author";

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

// Many to one relationship
Book.hasMany(BookCopy, {
    foreignKey: "book_id",
});
BookCopy.belongsTo(Book);

// Many to many relationship
Book.belongsToMany(Author, {
    through: BookAuthor,
    foreignKey: "book_id",
});
Author.belongsToMany(Book, {
    through: BookAuthor,
    foreignKey: "author_id",
});

console.log(Book === db.models.Book);
