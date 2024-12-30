# Deno Books

A simple book CRUD app written in Deno. 

Books are added by either creating a json file with the book's information or
searching through online data sources by ISBN to extract the information to be
added.

## Book Format

```typescript
interface BookInfo {
  isbn: string;
  title: string;
  authors: string[];
  illustrators?: string[];
  publisher?: string;
  publishDate?: string;
  pageCount?: number;
  source: string;
}
```

You can see an example of a book in [book.json](./book.json) in the root of
this project.

## Manual Entry

If you are adding a book manually that has no ISBN, set the `source` field to
`ManualEntry` and the `isbn` to the title of the book in lowercase without
spaces or punctuation, for example:

```json
{
  "isbn": "theshortstoriesofhgwells",
  "title": "The Short Stories of H.G. Wells",
  "authors": [
    "H. G. Wells"
  ],
  "publisher": "Ernest Benn Limited",
  "publishDate": "1923",
  "pageCount": 1148,
  "source": "ManualEntry"
}
```

## Data Sources

- [Open Library](https://openlibrary.org/)
- [Google Books](https://books.google.com/)

To add a data source, create a new class in the `sources` directory that extends
the `DataSource` class and implements the `search` method. The `search` method
should return a `Book` object if the book is found or `null` if it is not.

## Scripts

- `deno task addisbn <isbn>`: Search for a book by ISBN on open library or
  google books and if found add it to the database
- `deno task addjson <path>`: Add a book to the database based on a json file
  at a given path.
- `deno task deleteisbn <isbn>`: Delete a book from the database by a given ISBN
- `deno task editjson <path>`: Update the book information in the database with a
  json file at a given path with a corresponding existing ISBN
- `deno task lookup <term>`: Search the database for a book by title,
  author or illustrator. Use quotation marks (e.g. "like this") to contain
  multi-word searches, and use a blank string (" ") to list all books.
- `deno task searchisbn <isbn>`: Search the data sources for a book by ISBN
