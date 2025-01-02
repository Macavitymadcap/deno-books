import { addBook } from "./add-json.ts";
import { searchISBN } from "./search-isbn.ts";

if (import.meta.main) {
  const bookInfo = await searchISBN();
  if (!bookInfo) {
    Deno.exit(1);
  }

  await addBook(bookInfo);
}
