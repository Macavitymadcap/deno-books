import { BookDataSource, BookInfo } from "./model.ts";

export class OpenLibrarySource implements BookDataSource {
  name = "OpenLibrary";

  private async getAuthorName(authorKey: string): Promise<string> {
    try {
      const response = await fetch(`https://openlibrary.org${authorKey}.json`);
      if (!response.ok) return "Unknown Author";

      const author = await response.json();
      return author.personal_name || author.name || "Unknown Author";
    } catch {
      return "Unknown Author";
    }
  }

  async getBookByISBN(isbn: string): Promise<BookInfo | null> {
    try {
      const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
      if (!response.ok) return null;

      const data = await response.json();

      const authors = await Promise.all(
        (data.authors || []).map((author: { key: string }) =>
          this.getAuthorName(author.key)
        ),
      );

      const illustrators = data.contributors
        ?.filter((c: { role: string }) =>
          c.role.toLowerCase().includes("illustrat")
        )
        .map((c: { name: string }) => c.name || "Unknown Illustrator")
        .filter((name: string) => name !== "Unknown Illustrator") || [];

      return {
        isbn: isbn,
        title: data.title,
        authors: authors,
        ...(illustrators.length > 0 && { illustrators }),
        publisher: data.publishers?.[0],
        publishDate: data.publish_date,
        pageCount: data.number_of_pages,
        source: this.name,
      };
    } catch (error) {
      console.error("OpenLibrary fetch error:", error);
      return null;
    }
  }
}
