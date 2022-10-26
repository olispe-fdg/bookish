export interface BookRecord {
    id: number;
    title: string;
    subtitle: string;
    cover_photo_url: string;
    slug: string;
    isbn: string;
}

export class Book {
    record: BookRecord;

    constructor(record: BookRecord) {
        this.record = record;
    }

    toJSON() {
        return this.record;
    }
}
