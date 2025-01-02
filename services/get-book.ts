import { BookDatabase } from "../database/book-database.ts";
import { getBookInfoHTML } from "../templates/get-book-info-html.ts";
import { getCenteredChipHTML } from "../templates/get-centred-chip-html.ts";

export const getBook = (req: Request): Response => {
  const url = new URL(req.url);
  const pathname = decodeURIComponent(url.pathname);
  const isbn = pathname.split("/")[2];

  const bookDatabase = new BookDatabase("database/books.db");
  const bookInfo = bookDatabase.getBook(isbn);
  bookDatabase.closeDB();
  
  const response = bookInfo 
    ? getBookInfoHTML(bookInfo) 
    : getCenteredChipHTML(`Error Finding ISBN: ${isbn}`);
  
  return new Response(response, {headers: { "Content-Type": "text/html" },});
};
