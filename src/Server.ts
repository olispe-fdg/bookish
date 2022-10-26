import express from "express";
import db from "./Database";
import { AuthRoutes, BookRoutes } from "./controllers";

export class Server {
    app: express.Express;

    constructor() {
        this.app = express();
    }

    setupEndpoints() {
        this.app.use("/books", BookRoutes);
        this.app.use("/auth", AuthRoutes);
    }

    async start() {
        await db.connect();

        const port = 8080;

        this.setupEndpoints();

        this.app.listen(port, async () => {
            console.log(`Started server at http://localhost:${port}`);
        });
    }
}
