import { Client, QueryResult, QueryResultRow } from "pg";
import config from "./config";

async function main() {
    const client = new Client();
    await client.connect();

    await client.end();
}

class Database {
    client: Client;

    constructor() {
        const port = parseInt(config.get("DB_PORT"));
        if (Number.isNaN(port)) throw new Error("DB_PORT is not a number");

        this.client = new Client({
            user: config.get("DB_USERNAME"),
            password: config.get("DB_PASSWORD"),
            host: config.get("DB_HOST"),
            port: port,
            database: config.get("DB_NAME"),
        });
    }

    async connect() {
        await this.client.connect();
    }

    async end() {
        await this.client.end();
    }

    async query<RowType extends QueryResultRow>(
        queryString: string,
        parameters: string[] = []
    ): Promise<QueryResult<RowType>> {
        return await this.client.query<RowType, string[]>(
            queryString,
            parameters
        );
    }
}

export default new Database();
