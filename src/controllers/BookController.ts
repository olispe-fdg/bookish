import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { BookRecord } from "../data/Book";
import passport from "passport";
import db from "../db/db";
import { Book } from "../db/Book";

class BookController extends Controller {
    constructor() {
        super();

        this.router.use(passport.authenticate("jwt", { session: false }));
        this.bindGet("/", this.getBooks);
    }

    getBooks: RequestHandler = async (request, response, next) => {
        console.log("debug");
        const books = await Book.findAll();
        response.status(200).json(books);
    };
}

export default new BookController().router;
