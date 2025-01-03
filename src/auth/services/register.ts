import { AuthDatabase } from "../database/auth-database.ts";

export const register = async (req: Request) => {
  const formData = await req.formData();
  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const authDb = new AuthDatabase("src/database/auth.db");
  
  try {
    await authDb.addUser(username, password);
    authDb.closeDB();
    return new Response("User registered successfully");
  } catch (error) {
    authDb.closeDB();
    return new Response(`Registration failed with error: ${JSON.stringify(error)}`, { status: 400 });
  }
};