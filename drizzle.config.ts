import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

//all this info under drizzle website, configuration with neondb and postgresql

config({ path: ".env.local"});

export default defineConfig({
    schema: "./db/schema.ts",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!
    },
    verbose: true,
    strict: true,
});
