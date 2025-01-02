import { BookDatabase } from "../database/book-database.ts";
import { getBookInfoHTML } from "../templates/get-book-info-html.ts";

export const searchBooks = async (req: Request): Promise<Response> => {
  const formData = await req.formData();
  const searchTerm = formData.get("search-term")?.toString() || "";

  const bookDatabase = new BookDatabase("src/database/books.db");
  const result = bookDatabase.searchBooks(searchTerm);
  bookDatabase.closeDB();

  if (result.length > 0) {
    return new Response(result.map(getBookInfoHTML).join(""), {
      headers: { "Content-Type": "text/html" },
    });
  } else {
    return new Response(
      `<article class="centred">No books found matching search term: '${searchTerm}'</article>`,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  }
};
