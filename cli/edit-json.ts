import { BookDatabase } from "../database/book-database.ts";
import { BookInfo } from "../data-source/model.ts";
import { getJSONFromPath } from "./get-json-from-path.ts";

const editBook = (): Promise<void> => {
  const bookInfo = getJSONFromPath() as BookInfo;
  const bookDatabase = new BookDatabase("books.db");
  const dbBook = bookDatabase.getBook(bookInfo.isbn);
  if (!dbBook) {
    console.error(`Book with ISBN: ${bookInfo.isbn} not found.`);
    Deno.exit(1);
  }

  console.log(`Updating book: "${bookInfo.title}"`);
  bookDatabase.editBook(bookInfo);
  bookDatabase.closeDB();
  Deno.exit();
};

if (import.meta.main) {
  await editBook();
}
