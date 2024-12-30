import { BookDatabase } from "../database/book-database.ts";

const lookupBook = (): Promise<void> => {
  const searchTerm = Deno.args[0];
  if (!searchTerm) {
    console.error("Please provide a search term");
    Deno.exit(1);
  }

  console.log(`Searching database for books matching: '${searchTerm}'`);

  const db = new BookDatabase("books.db");
  const result = db.searchBooks(searchTerm);
  if (result.length === 0) {
    console.error(`No books found for search: '${searchTerm}'`);
    Deno.exit(1);
  }

  for (const book of result) {
    console.log(JSON.stringify(book, null, 2));
  }

  Deno.exit();
};

if (import.meta.main) {
  await lookupBook();
}
