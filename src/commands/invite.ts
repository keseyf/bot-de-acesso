import { Bot, Context } from "grammy";
import { PrismaClient } from "@prisma/client";
import { backMenu } from "../utils/menus";
const prisma = new PrismaClient();
import "dotenv/config"

const channelId = process.env.CHANNEL_ID;

if (!channelId) {
    throw new Error("Channel id is not defined")
}

export default async function invite(app: Bot, ctx: Context, msg: string) {
    try {
        const authorizedUsers = await prisma.user.findMany({
            where: {
                access: "full"
            }
        });

        for (const user of authorizedUsers) {
            if (user.telegramId) {
                try {
                    const userIsInChannel = await app.api.getChatMember(`${channelId}`, Number(user.telegramId));

                    if (!userIsInChannel || userIsInChannel.status === "left") {
                        const inviteLink = await app.api.createChatInviteLink(`${channelId}`, {
                            name: `Convite para ${user.firstName}`
                        });

                        console.log(`Usuário ${user.telegramId} não está no canal. Enviando link: ${inviteLink.invite_link}`);
                        ctx.deleteMessage()
                        app.api.sendMessage(String(user.telegramId), `${msg}\n\nLink do grupo: ${inviteLink.invite_link}`, { reply_markup: backMenu });
                        return
                    }
                } catch (error) {
                    console.error(`Erro ao verificar/adicionar ${user.telegramId}:`, error);
                }
            }
        }
    } catch (error) {
        console.error("Erro ao buscar usuários no banco de dados:", error);
    }
}