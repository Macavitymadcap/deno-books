import { BookInfo } from "../data-source/model.ts";
import { BookDatabase } from "../database/book-database.ts";
import { getBookInfoHTML } from "../templates/get-book-info-html.ts";


export const editBook = async (req: Request) => {
  const formData = await req.formData();
  
  const bookInfo: BookInfo = {
    isbn: formData.get("isbn")?.toString() || "",
    title: formData.get("title")?.toString() || "",
    authors: (formData.get("authors")?.toString() || "").split(",").map((
      author,
    ) => author.trim()),
    publisher: formData.get("publisher")?.toString() || "",
    publishDate: formData.get("publish-date")?.toString() || "",
    pageCount: parseInt(formData.get("page-count")?.toString() || ""),
    source: formData.get("source")?.toString() || "",
  };

  if (formData.get("illustrators")?.toString() !== "") {
    bookInfo.illustrators = (formData.get("illustrators")!.toString()).split(
      ",",
    ).map((illustrator) => illustrator.trim());
  }

  const bookDatabase = new BookDatabase("src/database/books.db");
  const oldBookInfo = bookDatabase.getBook(bookInfo.isbn);
  if (oldBookInfo) {
    bookDatabase.editBook(bookInfo);
  }
  bookDatabase.closeDB();

  const response = getBookInfoHTML(bookInfo);

  return new Response(response, { headers: { "Content-Type": "text/html" } });
};