import { serveDir } from "@std/http/file-server";
import { addBook } from "./services/add-book.ts";
import { addISBN } from "./services/add-isbn.ts";
import { confirmDeleteForm } from "./services/confirm-delete-form.ts";
import { deleteBook } from "./services/delete-book.ts";
import { editBookForm } from "./services/edit-book-form.ts";
import { editBook } from "./services/edit-book.ts";
import { getBook } from "./services/get-book.ts";
import { searchBooks } from "./services/search-books.ts";

export const handler = (): Deno.ServeHandler<Deno.NetAddr> => {
  return async (req: Request): Promise<Response> => {
    const rootPath = `${Deno.cwd()}/public`;
    const url = new URL(req.url);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/static")) {
      return serveDir(req, {
        fsRoot: `${rootPath}`,
      });
    }

    if (pathname === "/" && req.method === "GET") {
      const file = await Deno.open(`${rootPath}/index.html`, { read: true });
      return new Response(file.readable);
    }

    if (pathname.endsWith(".html") && req.method === "GET") {
      try {
        const file = await Deno.open(`${rootPath}${pathname}`, { read: true });
        return new Response(file.readable);
      } catch (error) {
        return new Response(`Not Found: ${JSON.stringify(error)}`, {
          status: 404,
        });
      }
    }

    if (pathname === "/search" && req.method === "POST") {
      return searchBooks(req);
    }

    if (pathname === "/addisbn" && req.method === "POST") {
      return addISBN(req);
    }

    if (pathname === "/addbook" && req.method === "POST") {
      return addBook(req);
    }

    if (pathname.startsWith("/editbookform") && req.method === "GET") {
      return editBookForm(req);
    }

    if (pathname.startsWith("/getbook") && req.method === "GET") {
      return getBook(req);
    }

    if (pathname.startsWith("/editbook") && req.method === "PATCH") {
      return editBook(req);
    }

    if (pathname.startsWith("/confirmdelete") && req.method === "GET") {
      return confirmDeleteForm(req);
    }

    if (pathname.startsWith("/deletebook") && req.method === "DELETE") {
      return deleteBook(req);
    }

    return new Response("Not Found", { status: 404 });
  };
}