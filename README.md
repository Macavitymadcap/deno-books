# Deno Books

A simpleCRUD web app written in Typescript, HTML, CSS and SQL using the 
[Deno](https://deno.com) runtime for storing data about the contents of
my bookshelves. 

The frontend and backend make use of [htmx](https://htmx.org) to achieve 
seemless UI updates without the need for a frontend framework. The backend
is a simple REST API that deals with a SQLite database. The app is deployed
with [fly](https://fly.io/).


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

You can see an example of a book in [book.json](./book.json) in the root of this
project.

## Data Sources

- [Open Library](https://openlibrary.org/)
- [Google Books](https://books.google.com/)

To add a data source, create a new class in the `sources` directory that extends
the `DataSource` class and implements the `search` method. The `search` method
should return a `Book` object if the book is found or `null` if it is not.

## Scripts

- `deno task serve`: Start the web server in watch mode.
