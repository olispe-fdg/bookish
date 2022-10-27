import express from "express";
import { AuthRoutes, BookRoutes } from "./controllers";
import config from "./config";

export class Server {
    app: express.Express;

    constructor() {
        this.app = express();
    }

    setupEndpoints() {
        this.app.use(express.json());
        this.app.use("/books", BookRoutes);
        this.app.use("/auth", AuthRoutes);
    }

    async start() {
        const port = parseInt(config.get("PORT"));
        if (Number.isNaN(port)) {
            throw new Error("Configured port is not a number");
        }

        this.setupEndpoints();

        this.app.listen(port, async () => {
            console.log(`Started server at http://localhost:${port}`);
        });
    }
}
