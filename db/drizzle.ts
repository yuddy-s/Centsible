import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export const sql = neon(process.env.DATABASE_URL!) as NeonQueryFunction<boolean, boolean>;
export const db = drizzle(sql, { schema });

// const accounts2 = db.select().from(schema.accounts).where(eq())
