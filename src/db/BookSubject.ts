import { DataTypes } from "sequelize";
import db from "./db";

export const BookSubject = db.define(
    "BookSubject",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "book_subject",
        timestamps: false,
    }
);

console.log(BookSubject === db.models.BookSubject);
