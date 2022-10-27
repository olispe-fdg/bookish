import { RequestHandler, Router } from "express";
import { Schema } from "../interface/schema.interface";

export class Controller {
    router: Router;

    constructor() {
        this.router = Router();
    }

    protected bindGet(endpoint: string, callback: RequestHandler) {
        this.router.get(endpoint, callback.bind(this));
    }

    protected bindPost(endpoint: string, ...handlers: RequestHandler[]) {
        this.router.post(
            endpoint,
            ...handlers.map((handler) => handler.bind(this))
        );
    }

    protected validateBody: (schema: Schema) => RequestHandler = (
        schema: Schema
    ) => {
        return (req, res, next) => {
            const invalidKeys: string[] = [];

            Object.keys(schema).forEach((key) => {
                if (schema[key].type === "array") {
                    if (!(req.body[key] instanceof Array)) {
                        return invalidKeys.push(key);
                    }
                    return;
                }

                if (typeof req.body[key] !== schema[key].type) {
                    return invalidKeys.push(key);
                }
            });

            if (invalidKeys.length > 0) {
                return res
                    .status(400)
                    .json({ message: "Keys invalid", keys: invalidKeys });
            }

            return next();
        };
    };
}
