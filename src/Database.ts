import { Client, QueryResult, QueryResultRow } from "pg";

async function main() {
    const client = new Client();
    await client.connect();

    await client.end();
}

class Database {
    client: Client;

    constructor() {
        const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } =
            process.env;

        if (!DB_USERNAME) throw new Error("DB_USERNAME is not set");
        if (!DB_PASSWORD) throw new Error("DB_PASSWORD is not set");
        if (!DB_HOST) throw new Error("DB_HOST is not set");
        if (!DB_PORT) throw new Error("DB_PORT is not set");
        if (!DB_NAME) throw new Error("DB_NAME is not set");

        const port = parseInt(DB_PORT);
        if (Number.isNaN(port)) throw new Error("DB_PORT is not a number");

        this.client = new Client({
            user: DB_USERNAME,
            password: DB_PASSWORD,
            host: DB_HOST,
            port: port,
            database: DB_NAME,
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
