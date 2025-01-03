import { create, verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

export const createSession = async (username: string): Promise<string> => {
  return await create(
    { alg: "HS512", typ: "JWT" },
    { username, exp: Date.now() + 24*60*60*1000 },
    key
  );
};

export const validateSession = async (token: string): Promise<boolean> => {
  try {
    await verify(token, key);
    return true;
  } catch {
    return false;
  }
};