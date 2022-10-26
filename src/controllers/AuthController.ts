import { RequestHandler } from "express";
import { Controller } from "./Controller";
import bcrypt from "bcrypt";
import db from "../Database";
import { DatabaseError } from "pg";

class AuthController extends Controller {
    constructor() {
        super();

        this.bindPost("/login", this.loginUser);
        this.bindPost("/register", this.registerUser);
    }

    registerUser: RequestHandler = async (req, res) => {
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

    loginUser: RequestHandler = (req, res) => {
        return res.status(200);
    };
}

export default new AuthController().router;
