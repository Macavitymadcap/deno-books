import { BookDatabase } from "../database/book-database.ts";

const deleteBook = () => {
  const isbn = Deno.args[0];
  if (!isbn) {
    console.error("Please provide an ISBN");
    Deno.exit(1);
  }

  const bookDatabase = new BookDatabase("books.db");
  bookDatabase.deleteBook(isbn);
  bookDatabase.closeDB();
  console.log(`Deleted book with ISBN: ${isbn}`);
  Deno.exit();
};

if (import.meta.main) {
  deleteBook();
}
