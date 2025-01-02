import { BookDatabase } from "../database/book-database.ts";
import { getCenteredChipHTML } from "../templates/get-centred-chip-html.ts";
import { getEditBookFormHTML } from "../templates/get-edit-book-form.ts";

export const editBookForm = (req: Request) => {
  const url = new URL(req.url);
  const pathname = decodeURIComponent(url.pathname);
  const isbn = pathname.split("/")[2];

  const bookDatabase = new BookDatabase("src/database/books.db");
  const oldBookInfo = bookDatabase.getBook(isbn);
  bookDatabase.closeDB();

  const response = oldBookInfo
    ? getEditBookFormHTML(oldBookInfo)
    : getCenteredChipHTML(`Error Finding ISBN: ${isbn}`);

  return new Response(response, { headers: { "Content-Type": "text/html" } });
};
