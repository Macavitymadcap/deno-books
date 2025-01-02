import { BookInfo } from "../data-source/model.ts";
import { BookDatabase } from "../database/book-database.ts";
import { getBookFormHTML } from "../templates/get-book-form-html.ts";
import { getCenteredChipHTML } from "../templates/get-centred-chip-html.ts";

export const addBook = async (req: Request) => {
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
  let response;
  try {
    bookDatabase.addBook(bookInfo);
    response = getCenteredChipHTML(`Book: ${bookInfo.title} added successfully`) + getBookFormHTML({
      isbn: "",
      title: "",
      authors: [],
      source: ""
    });
  } catch (error) {
    response = getCenteredChipHTML(`Error adding book: ${error}`) + getBookFormHTML(bookInfo);
  }
  bookDatabase.closeDB();

  return new Response(response, { headers: { "Content-Type": "text/html" } });
};
