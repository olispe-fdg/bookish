const { JWT_SECRET } = process.env;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

class Config {
    private data: { [key: string]: string } = {};

    config(keys: string[]) {
        keys.forEach((key) => {
            const value = process.env[key];

            if (!value) {
                throw new Error(`${key} is not set in .env`);
            }

            this.data[key] = value;
        });
    }

    get(key: string): string {
        const value = this.data;

        if (!value) {
            throw new Error(`${key} is not a valid key`);
        }

        return this.data[key];
    }
}

export default new Config();
