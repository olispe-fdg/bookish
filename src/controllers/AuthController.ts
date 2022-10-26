import { RequestHandler } from "express";
import { Controller } from "./Controller";
import bcrypt from "bcrypt";
import db from "../Database";
import { DatabaseError } from "pg";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

class AuthController extends Controller {
    constructor() {
        super();

        this.bindPost("/login", this.credentials, this.loginUser);
        this.bindPost("/register", this.credentials, this.registerUser);
    }

    credentials: RequestHandler = async (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({ message: "Body is required" });
        }

        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        return next();
    };

    registerUser: RequestHandler = async (req, res) => {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            await db.query(
                "INSERT INTO account (email, password) VALUES ($1::text, $2::text)",
                [email, hashedPassword]
            );
        } catch (e) {
            if (e instanceof DatabaseError) {
                if (e.constraint) {
                    return res.status(400).json({
                        message: "A user with that email already exists",
                    });
                }
            }
        }

        const accountQuery = await db.query(
            "SELECT id FROM account WHERE email=$1::text",
            [email]
        );

        if (accountQuery.rows.length !== 1) {
            return res.status(500).json({ message: "Something went wrong" });
        }

        return res.status(201).json({ account: accountQuery.rows[0] });
    };

    loginUser: RequestHandler = async (req, res) => {
        const { email, password } = req.body;

        const accountQuery = await db.query(
            "SELECT * FROM account WHERE email=$1::text",
            [email]
        );

        if (accountQuery.rowCount === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const account = accountQuery.rows[0];

        if (!(await bcrypt.compare(password, account.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email }, JWT_SECRET as string, {
            expiresIn: "1h",
        });

        return res.status(200).json({ token: token });
    };
}

export default new AuthController().router;
