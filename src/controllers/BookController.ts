import { RequestHandler } from "express";
import db from "../Database";
import { Controller } from "./Controller";
import { BookRecord } from "../data/Book";

class BookController extends Controller {
    constructor() {
        super();

        this.bindGet("/", this.getBooks);
    }

    getBooks: RequestHandler = async (request, response, next) => {
        console.log("debug");
        const book = await db.query<BookRecord>("SELECT * FROM book");
        response.status(200).json(book.rows);
    };
}

export default new BookController().router;
