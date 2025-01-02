import { getBookByISBN } from "../data-source/get-book-by-isbn.ts";
import { BookInfo } from "../data-source/model.ts";
import { getBookFormHTML } from "../templates/get-book-form-html.ts";
import { getCenteredChipHTML } from "../templates/get-centred-chip-html.ts";

const blankBook: BookInfo = {
  isbn: "",
  title: "",
  authors: [],
  illustrators: [],
  publisher: "",
  publishDate: "",
  pageCount: 0,
  source: "",
};

export const addISBN = async (req: Request) => {
  const formData = await req.formData();
  const isbn = formData.get("addisbn")?.toString() || "";
  const bookInfo = await getBookByISBN(isbn);

  if (!bookInfo) {
    const response = getCenteredChipHTML(`No book found with ISBN: '${isbn}'`) +
      getBookFormHTML(blankBook);
    return new Response(response, { headers: { "Content-Type": "text/html" } });
  }

  return new Response(getBookFormHTML(bookInfo), {
    headers: { "Content-Type": "text/html" },
  });
};
