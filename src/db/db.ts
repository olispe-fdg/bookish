import { Sequelize } from "sequelize";
import config from "../config";

class Database {
    sequelize: Sequelize;

    constructor() {
        const port = parseInt(config.get("DB_PORT"));
        if (Number.isNaN(port)) throw new Error("DB_PORT is not a number");

        this.sequelize = new Sequelize({
            dialect: "postgres",
            username: config.get("DB_USERNAME"),
            password: config.get("DB_PASSWORD"),
            host: config.get("DB_HOST"),
            port: port,
            database: config.get("DB_NAME"),
        });

        this.testConnection();
    }

    async testConnection() {
        try {
            await this.sequelize.authenticate();
            console.log(
                "Connection to database has been establish successfully"
            );
        } catch (error) {
            console.log("Unable to connect to database", error);
        }
    }
}

export default new Database().sequelize;
