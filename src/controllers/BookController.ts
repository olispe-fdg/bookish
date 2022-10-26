import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { BookRecord } from "../data/Book";
import passport from "passport";
import db from "../db/db";

class BookController extends Controller {
    constructor() {
        super();

        this.router.use(passport.authenticate("jwt", { session: false }));
        this.bindGet("/", this.getBooks);
    }

    getBooks: RequestHandler = async (request, response, next) => {
        console.log("debug");
        response.status(200).json([]);
    };
}

export default new BookController().router;
