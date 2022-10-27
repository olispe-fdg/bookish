import { RequestHandler } from "express";
import { Controller } from "./Controller";
import passport from "passport";
import { Book } from "../db/Book";
import { Schema } from "../interface/schema.interface";

const SearchParams: Schema = {
    title: {
        type: "string",
        optional: true,
    },
    author: {
        type: "string",
        optional: true,
    },
};

const NewBookBody: Schema = {
    title: {
        type: "string",
    },
    subtitle: {
        type: "string",
    },
    cover_photo_url: { type: "string" },
    isbn: {
        type: "number",
    },
    copies: {
        type: "number",
    },
    authors: {
        type: "array",
    },
    subjects: {
        type: "array",
    },
};

class BookController extends Controller {
    constructor() {
        super();

        this.router.use(passport.authenticate("jwt", { session: false }));
        this.bindGet(
            "/",
            this.validateQueryParams(SearchParams),
            this.getBooks
        );
        this.bindPost("/", this.validateBody(NewBookBody), this.createBook);
    }

    getBooks: RequestHandler = async (request, response, next) => {
        console.log(request.query);
        const books = await Book.findAll();
        response.status(200).json(books);
    };

    createBook: RequestHandler = async (request, response) => {
        return response.status(201).json();
    };
}

export default new BookController().router;
