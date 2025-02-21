import { Context } from "grammy";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function register(ctx: Context) {
    const user = await prisma.user.create({
        data: {
            telegramId: ctx.chat?.id,
            firstName: ctx.chat?.first_name
        }
    })
    console.log(user)
    return user
}