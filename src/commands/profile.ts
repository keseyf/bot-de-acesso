import { PrismaClient } from "@prisma/client";
import { Context } from "grammy";
import { profileMenu } from "../utils/menus";
const prisma = new PrismaClient();

export default async function profile(ctx: Context) {

  ctx.deleteMessage();
  const perfil = await prisma.user.findUnique({
    where: {
      telegramId: ctx.chatId,
    },
  });
  if (perfil) {
    ctx.reply(`👤 Seu perfil:

🆔 \*ID\*: ${perfil.telegramId}
💳 \*Nome\*: ${perfil.firstName}
🔑 \*Access Type\*: ${perfil.access}

\*Data de criação\*: ${perfil.createdAt.toLocaleString()}
            `, { parse_mode: "MarkdownV2", reply_markup: profileMenu });
  } else {
    const perfil = await prisma.user.create({
      data: {
        telegramId: ctx.chatId,
        firstName: ctx.chat?.first_name
      },
    });
    ctx.reply(`👤 Seu perfil:

🆔 \*ID\*: ${perfil.telegramId}
💳 \*Nome\*: ${perfil.firstName}
🔑 \*Access Type\*: ${perfil.access}

\*Data de criação\*: ${perfil.createdAt.toLocaleString()}
            `, { parse_mode: "MarkdownV2", reply_markup: profileMenu });
  }
}
