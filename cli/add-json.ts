import { BookInfo } from "../data-source/model.ts";
import { BookDatabase } from "../database/book-database.ts";
import { getJSONFromPath } from "./get-json-from-path.ts";

export const addBook = (bookInfo: BookInfo): Promise<void> => {
  const bookDatabase = new BookDatabase("books.db");
  console.log(`Adding book: "${bookInfo.title}"`);
  bookDatabase.addBook(bookInfo);
  bookDatabase.closeDB();
  Deno.exit();
};

if (import.meta.main) {
  const bookInfo = getJSONFromPath() as BookInfo;
  await addBook(bookInfo);
}
