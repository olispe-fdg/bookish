CREATE TABLE IF NOT EXISTS account (
	id SERIAL PRIMARY KEY,
	email TEXT,
	password TEXT
);

CREATE TABLE IF NOT EXISTS book (
	id SERIAL PRIMARY KEY,
	title TEXT,
	subtitle TEXT,
	cover_photo_url TEXT,
	slug VARCHAR(255) UNIQUE,
	isbn INT UNIQUE
);

CREATE TABLE IF NOT EXISTS checkout (
	id SERIAL PRIMARY KEY,
	account_id INT REFERENCES account (id),
	book_id INT REFERENCES book (id),
	checkout_date DATE,
	due_date DATE,
	return_date DATE
);

CREATE TABLE IF NOT EXISTS book_copy (
	id SERIAL PRIMARY KEY,
	book_id INT REFERENCES book (id),
	current_checkout INT REFERENCES checkout (id)
);

CREATE TABLE IF NOT EXISTS author (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS subject (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS book_author (
	id SERIAL PRIMARY KEY,
	book_id INT REFERENCES book (id),
	author_id INT REFERENCES author (id)
);

CREATE TABLE IF NOT EXISTS book_subject (
	id SERIAL PRIMARY KEY,
	book_id INT REFERENCES book (id),
	subject_id INT REFERENCES subject (id)
);
