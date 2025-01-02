import { handler } from "./src/handler.ts";

Deno.serve({port: 8000, hostname: "0.0.0.0"}, handler());
