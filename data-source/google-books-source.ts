import { BookDataSource, BookInfo } from "./model.ts";

export class GoogleBooksSource implements BookDataSource {
  name = "Google Books";

  async getBookByISBN(isbn: string): Promise<BookInfo | null> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`,
      );
      if (!response.ok) return null;

      const data = await response.json();
      if (!data.items?.[0]?.volumeInfo) return null;

      const volumeInfo = data.items[0].volumeInfo;

      // Extract illustrators if present
      const contributors = volumeInfo.authors || [];
      const authors: string[] = [];
      const illustrators: string[] = [];

      // Google Books sometimes includes illustrator information in the author field
      // with formats like "Author (Illustrator)" or "Author, Illustrator"
      contributors.forEach((contributor: string) => {
        if (contributor.toLowerCase().includes("illustrator")) {
          const illustrator = contributor
            .replace(/\(illustrator\)/i, "")
            .replace(/,\s*illustrator/i, "")
            .trim();
          illustrators.push(illustrator);
        } else {
          authors.push(contributor);
        }
      });

      return {
        isbn: isbn,
        title: volumeInfo.title,
        authors: authors.length > 0 ? authors : ["Unknown Author"],
        ...(illustrators.length > 0 && { illustrators }),
        publisher: volumeInfo.publisher,
        publishDate: volumeInfo.publishedDate,
        pageCount: volumeInfo.pageCount,
        source: this.name,
      };
    } catch (error) {
      console.error("Google Books fetch error:", error);
      return null;
    }
  }
}
