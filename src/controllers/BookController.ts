import { RequestHandler } from "express";
import { Controller } from "./Controller";
import passport from "passport";
import { Book } from "../db/Book";
import { Schema } from "../interface/schema.interface";
import sequelize, { Op, UniqueConstraintError } from "sequelize";
import { Author } from "../db/Author";
import { BookAuthor } from "../db/BookAuthor";
import db from "../db/db";
import slug from "limax";

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
        const { title, author } = request.query as {
            title: string;
            author: string;
        };

        let where: { [key: string]: any } = {};
        if (title) {
            where.title = sequelize.where(
                sequelize.fn("LOWER", sequelize.col("title")),
                "LIKE",
                `%${title.toLowerCase()}%`
            );
        }

        const books = await Book.findAll({
            where: where,
            include: {
                model: Author,
                attributes: ["name"],
                through: {
                    attributes: [],
                },
                as: "authors",
            },
        });
        response.status(200).json(books);
    };

    createBook: RequestHandler = async (request, response) => {
        const {
            title,
            subtitle,
            cover_photo_url,
            isbn,
            copies,
            authors,
            subjects,
        } = request.body;

        try {
            const book = await Book.create({
                title,
                subtitle,
                cover_photo_url,
                isbn,
                slug: await this.generateSlug(title),
            });

            return response.status(201).json({ book });
        } catch (e) {
            if (e instanceof UniqueConstraintError) {
                return response
                    .status(400)
                    .json({ message: "A book with that ISBN already exists" });
            }
        }
    };

    private async generateSlug(title: string): Promise<string> {
        const base = slug(title);

        const { rows, count } = await Book.findAndCountAll({
            where: {
                slug: {
                    [Op.like]: `${base}%`,
                },
            },
        });

        if (count > 0) {
            return `${base}-${count}`;
        }

        return base;
    }
}

export default new BookController().router;
