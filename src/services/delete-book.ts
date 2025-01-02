import { BookDatabase } from "../database/book-database.ts";
import { getCenteredChipHTML } from "../templates/get-centred-chip-html.ts";

export const deleteBook = (req: Request): Response => {
  const url = new URL(req.url);
  const pathname = decodeURIComponent(url.pathname);
  const isbn = pathname.split("/")[2];


  const bookDatabase = new BookDatabase("src/database/books.db");
  const bookInfo = bookDatabase.getBook(isbn);
  if (bookInfo) {
    bookDatabase.deleteBook(isbn);
  }
  bookDatabase.closeDB();

  const response = bookInfo
    ? getCenteredChipHTML(`Deleted Book: ${bookInfo.title}`)
    : getCenteredChipHTML(`Error Finding ISBN: ${isbn}`);

  return new Response(response, { headers: { "Content-Type": "text/html" } });
};
