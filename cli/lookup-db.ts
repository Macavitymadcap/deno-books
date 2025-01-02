import { BookDatabase } from "../database/book-database.ts";

const lookupBook = (): Promise<void> => {
  const searchTerm = Deno.args[0];
  if (!searchTerm) {
    console.error("Please provide a search term");
    Deno.exit(1);
  }

  const db = new BookDatabase("database/books.db");
  const result = db.searchBooks(searchTerm);
  if (result.length === 0) {
    console.error(`No books found for search: '${searchTerm}'`);
    Deno.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
  Deno.exit();
};

if (import.meta.main) {
  await lookupBook();
}
