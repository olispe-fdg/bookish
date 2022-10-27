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
import { BookCopy } from "../db/BookCopy";
import { Subject } from "../db/Subject";
import { BookSubject } from "../db/BookSubject";

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
        this.bindPost("/", this.validateBody(NewBookBody), this.postBook);
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
            include: [
                {
                    model: Author,
                    attributes: ["name"],
                    through: {
                        attributes: [],
                    },
                    as: "authors",
                },
                {
                    model: Subject,
                    attributes: ["name"],
                    through: {
                        attributes: [],
                    },
                    as: "subjects",
                },
            ],
        });
        response.status(200).json(books);
    };

    postBook: RequestHandler = async (request, response) => {
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

            const bookId = book.get("id") as number;

            await this.createBookAuthors(bookId, authors);

            await this.createBookSubjects(bookId, subjects);

            console.log("Creating copies");
            await this.createBookCopies(bookId, copies);

            return response.status(201).json({ book });
        } catch (e) {
            if (e instanceof UniqueConstraintError) {
                return response
                    .status(400)
                    .json({ message: "A book with that ISBN already exists" });
            }
        }
    };

    private async createBookCopies(bookId: number, copies: number) {
        const bookCopies = Array.from({ length: copies }, () => ({
            book_id: bookId,
        }));

        await BookCopy.bulkCreate(bookCopies);
    }

    private async createBookSubjects(bookId: number, subjects: string[]) {
        const subjectIds = await Promise.all(
            subjects.map(async (name: string) => {
                const row = await Subject.findOne({ where: { name } });

                if (row) return row.get("id");

                const newSubject = await Subject.create({ name: name });

                return newSubject.get("id");
            })
        );

        await BookSubject.bulkCreate(
            subjectIds.map((subjectId) => ({
                book_id: bookId,
                subject_id: subjectId,
            }))
        );
    }

    private async createBookAuthors(bookId: number, authors: string[]) {
        const authorIds = await Promise.all(
            authors.map(async (name: string) => {
                const row = await Author.findOne({ where: { name } });

                if (row) return row.get("id");

                const newAuthor = await Author.create({ name: name });

                return newAuthor.get("id");
            })
        );

        await BookAuthor.bulkCreate(
            authorIds.map((authorId) => ({
                book_id: bookId,
                author_id: authorId,
            }))
        );
    }

    private async generateSlug(title: string): Promise<string> {
        const base = slug(title);

        const count = await Book.count({
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
