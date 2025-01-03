import { AuthDatabase } from "../database/auth-database.ts";
import { createSession } from "../session/session.ts";

export const login = async (req: Request) => {
  const formData = await req.formData();
  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const authDb = new AuthDatabase("src/database/auth.db");
  const isValid = await authDb.validateUser(username, password);
  authDb.closeDB();

  if (!isValid) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const token = await createSession(username);
  const searchHtml = await Deno.readTextFile(`${Deno.cwd()}/public/search.html`);
  const script = `<script>localStorage.setItem('token', '${token}');</script>`;
  return new Response(script + searchHtml, {
    headers: { "Content-Type": "text/html" }
  });
};