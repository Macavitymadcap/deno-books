import { BookDataSource, BookInfo } from "./model.ts";
import { OpenLibrarySource } from "./open-library-source.ts";
import { GoogleBooksSource } from "./google-books-source.ts";

function cleanISBN(isbn: string): string {
  return isbn.replace(/[-\s]/g, "");
}

export async function getBookByISBN(isbn: string): Promise<BookInfo | null> {
  const cleanedISBN = cleanISBN(isbn);

  const sources: BookDataSource[] = [
    new OpenLibrarySource(),
    new GoogleBooksSource(),
  ];

  for (const source of sources) {
    const result = await source.getBookByISBN(cleanedISBN);
    if (result) {
      return result;
    }
  }

  return null;
}
