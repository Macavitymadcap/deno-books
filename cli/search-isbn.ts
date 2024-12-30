import { getBookByISBN } from "../data-source/get-book-by-isbn.ts";
import { BookInfo } from "../data-source/model.ts";

export const searchISBN = async (): Promise<BookInfo | undefined> => {
  const isbn = Deno.args[0];
  if (!isbn) {
    console.error("Please provide an ISBN");
    Deno.exit(1);
  }

  const bookInfo = await getBookByISBN(isbn);
  if (bookInfo) {
    console.log(JSON.stringify(bookInfo, null, 2));
    return bookInfo;
  } else {
    console.error(`Book with ISBN: ${isbn} not found.`);
    return undefined;
  }
};

if (import.meta.main) {
  await searchISBN();
}
