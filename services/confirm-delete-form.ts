import { BookDatabase } from "../database/book-database.ts";
import { getCenteredChipHTML } from "../templates/get-centred-chip-html.ts";
import { getConfirmDeleteBookHTML } from "../templates/get-confirm-delete-book-html.ts";

export const confirmDeleteForm = (req: Request) => {
  const url = new URL(req.url);
  const pathname = decodeURIComponent(url.pathname);
  const isbn = pathname.split("/")[2];

  const bookDatabase = new BookDatabase("database/books.db");
  const bookInfo = bookDatabase.getBook(isbn);
  bookDatabase.closeDB();

  const response = bookInfo
    ? getConfirmDeleteBookHTML(bookInfo)
    : getCenteredChipHTML(`Error Finding ISBN: ${isbn}`);

  return new Response(response, { headers: { "Content-Type": "text/html" } });
};
