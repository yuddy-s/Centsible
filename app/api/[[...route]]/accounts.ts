import { z } from "zod";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2" //creates non colliding unique id for each account we create

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";


const app = new Hono()
    .get("/", 
    clerkMiddleware(),
     async (c) => {
        const auth = getAuth(c)

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401)
        };

        const data = await db
        .select({
            id: accounts.id,
            name: accounts.name
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId)) //to see if user Id currently matches logged in user and to return account only belonging to that user 

    return c.json({ data })
    })
    .get(
        "/:id",
    zValidator("param", z.object({
        id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param"); 

        if(!id) {
            return c.json({ error: "Missing Id" }, 400);
        }

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db
        .select({ /*using .select automatically has the .returning() method so we dont need to write it */
            id: accounts.id,
            name: accounts.name
        })
        .from(accounts)
        .where(
            and(
                eq(accounts.userId, auth.userId),
                eq(accounts.id, id) //to see if user Id currently matches logged in user and to return account only belonging to that user
            )
        );
        
        if(!data) {
            return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data });
    }

    )
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertAccountSchema.pick({
            name: true
        })),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json");

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }
            
            const [data] = await db.insert(accounts).values({ /*putting brackets around data destructures it and we can just return data in the json as is, use only if one element that you are returning */
                id: createId(),
                userId: auth.userId,
                ...values,
            }).returning(); /*without .returning, this data object holds nothing */

            return c.json({ data })
        
    })
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids: z.array(z.string()),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const getValues = c.req.valid("json");

            if(!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }
            
            const data = await db 
                .delete(accounts)
              .where(
                and(
                    eq(accounts.userId, auth.userId),
                    inArray(accounts.id, getValues.ids)
                )
              )
              .returning({
                id: accounts.id
              });
              
              return c.json({ data })
        },
    )
    .patch(
        "/:id", 
        clerkMiddleware(), 
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
        })
    ),
    zValidator(
        "json",
        insertAccountSchema.pick({
            name: true
        })
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");
        const values = c.req.valid("json");

        if(!id) {
            return c.json({ error: "Missing id"}, 400);
        }

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }


        const [data] = await db
            .update(accounts)
            .set(values)
            .where(
                and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.id, id)
                ),
            )
            .returning();

        if(!data) {
            return c.json({ error: "Not found"}, 404);
        }

        return c.json({ data });
    }

    )
    .delete(
        "/:id", 
        clerkMiddleware(), 
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
        })
    ),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if(!id) {
            return c.json({ error: "Missing id"}, 400);
        }

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }


        const [data] = await db
            .delete(accounts)
            .where(
                and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.id, id)
                ),
            )
            .returning({
                id: accounts.id,
            });

        if(!data) {
            return c.json({ error: "Not found"}, 404);
        }

        return c.json({ data });
    }

    )

export default app;