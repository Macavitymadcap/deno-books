import { validateSession } from "../session/session.ts";

export const requireAuth = async (req: Request): Promise<boolean> => {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return false;
    return await validateSession(token);
  };