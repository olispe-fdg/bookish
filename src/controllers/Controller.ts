import { RequestHandler, Router } from "express";
import { Schema } from "../interface/schema.interface";

type ValidatorMiddleware = (schema: Schema) => RequestHandler;

export class Controller {
    router: Router;

    constructor() {
        this.router = Router();
    }

    protected bindGet(endpoint: string, ...handlers: RequestHandler[]) {
        this.router.get(
            endpoint,
            ...handlers.map((handler) => handler.bind(this))
        );
    }

    protected bindPost(endpoint: string, ...handlers: RequestHandler[]) {
        this.router.post(
            endpoint,
            ...handlers.map((handler) => handler.bind(this))
        );
    }

    private validate(data: any, schema: Schema): string[] {
        const invalidKeys: string[] = [];

        Object.keys(schema).forEach((key) => {
            if (schema[key].optional) return;

            if (schema[key].type === "array") {
                if (!(data[key] instanceof Array)) {
                    return invalidKeys.push(key);
                }
                return;
            }

            if (typeof data[key] !== schema[key].type) {
                return invalidKeys.push(key);
            }
        });

        return invalidKeys;
    }

    protected validateQueryParams: ValidatorMiddleware = (schema) => {
        return (req, res, next) => {
            const invalidKeys = this.validate(req.query, schema);
            if (invalidKeys.length > 0) {
                return res.status(400).json({
                    message: "Query params invalid",
                    keys: invalidKeys,
                });
            }

            return next();
        };
    };

    protected validateBody: ValidatorMiddleware = (schema) => {
        return (req, res, next) => {
            const invalidKeys = this.validate(req.body, schema);
            if (invalidKeys.length > 0) {
                return res.status(400).json({
                    message: "Request body invalid",
                    keys: invalidKeys,
                });
            }

            return next();
        };
    };
}
