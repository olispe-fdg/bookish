import { RequestHandler } from "express";
import { Controller } from "./Controller";
import bcrypt from "bcrypt";
import db from "../db/db";
import jwt from "jsonwebtoken";
import config from "../config";
import { UniqueConstraintError } from "sequelize";
import { Account } from "../db/Account";

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
            await Account.create({
                email,
                password: hashedPassword,
            });
        } catch (e) {
            if (e instanceof UniqueConstraintError) {
                return res.status(400).json({
                    message: "A user with that email already exists",
                });
            }
        }

        const account = await Account.findOne({
            attributes: ["", "email"],
            where: { email },
        });

        if (!account) {
            return res.status(500).json({ message: "Something went wrong" });
        }

        return res.status(201).json({ account });
    };

    loginUser: RequestHandler = async (req, res) => {
        const { email, password } = req.body;

        const account = await db.models.Account.findOne({
            attributes: ["email", "password"],
            where: { email },
        });

        if (!account) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (
            !(await bcrypt.compare(password, account.get("password") as string))
        ) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email }, config.get("JWT_SECRET") as string, {
            expiresIn: "1h",
        });

        return res.status(200).json({ token: token });
    };
}

export default new AuthController().router;
