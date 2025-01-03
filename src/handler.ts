import { serveDir } from "@std/http/file-server";
import { addBook } from "./services/add-book.ts";
import { addISBN } from "./services/add-isbn.ts";
import { confirmDeleteForm } from "./services/confirm-delete-form.ts";
import { deleteBook } from "./services/delete-book.ts";
import { editBookForm } from "./services/edit-book-form.ts";
import { editBook } from "./services/edit-book.ts";
import { getBook } from "./services/get-book.ts";
import { searchBooks } from "./services/search-books.ts";
import { requireAuth } from "./auth/middleware/auth-middleware.ts";
import { login } from "./auth/services/login.ts";
import { register } from "./auth/services/register.ts";

const PUBLIC_PATHS = [
  '/',
  '/static',
  '/login.html',
  '/register.html',
  '/login',
  '/register'
];

export const handler = (): Deno.ServeHandler<Deno.NetAddr> => {
  return async (req: Request): Promise<Response> => {
    const rootPath = `${Deno.cwd()}/public`;
    const url = new URL(req.url);
    const pathname = decodeURIComponent(url.pathname);

    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      if (pathname.startsWith("/static")) {
        return serveDir(req, { fsRoot: `${Deno.cwd()}/public` });
      }
      
      if (pathname === "/" || pathname === "/index.html") {
        const file = await Deno.open(`${Deno.cwd()}/public/index.html`, { read: true });
        return new Response(file.readable);
      }

      if (pathname === "/login") {
        return login(req);
      }

      if (pathname === "/register") {
        return register(req);
      }

      if (pathname.endsWith('login.html') || pathname.endsWith('register.html')) {
        const file = await Deno.open(`${Deno.cwd()}/public${pathname}`, { read: true });
        return new Response(file.readable);
      }
    }

    if (!await requireAuth(req)) {
      return new Response("Unauthorized", { status: 401 });
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