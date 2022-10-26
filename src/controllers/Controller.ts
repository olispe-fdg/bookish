import { RequestHandler, Router } from "express";

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
}
