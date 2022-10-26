import { RequestHandler } from "express";
import { Controller } from "./Controller";
import db from "../Database";

class AuthController extends Controller {
    constructor() {
        super();

        this.bindPost("/login", this.loginUser);
        this.bindPost("/register", this.registerUser);
    }

    registerUser: RequestHandler = (req, res) => {
        return res.status(201);
    };

    loginUser: RequestHandler = (req, res) => {
        return res.status(200);
    };
}

export default new AuthController().router;
