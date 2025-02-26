import { Bot, Context } from "grammy";
import { PrismaClient } from "@prisma/client";
import invite from "./invite";
import { backMenu } from "../utils/menus";
import 'dotenv/config';

const channelId = process.env.CHANNEL_ID;

if (!channelId) {
    throw new Error("No channeel id defined")
}

const prisma = new PrismaClient();

export default async function verification(app: Bot, ctx: Context) {
    try {
        let dataFinded = false;
        await ctx.editMessageText("🎲 Verificando Banco de dados...");

        const telegramId = ctx.chat?.id;
        if (!telegramId) return await ctx.editMessageText("Erro ao obter ID do usuário. 🤔");

        const user = await prisma.user.findUnique({
            where: { telegramId },
        });

        if (!user) return await ctx.editMessageText("Usuário não encontrado no banco de dados. 🤔");
        await ctx.editMessageText("👀 Verificando presença...");

        setTimeout(async () => {
            if (!dataFinded) {
                await ctx.editMessageText("🕰 Isto pode demorar algum tempo");
            }
        }, 3000);

        const chatMember = await app.api.getChatMember(Number(channelId), Number(telegramId));
        if (chatMember) {
            dataFinded = true;
        }
        if (["left", "kicked"].includes(chatMember.status)) {
            invite(app, ctx, "🤔 Parece que você não está no canal! Eis aqui o link do canal. 😁");
            return;
        }
        await ctx.editMessageText("✅ Você já está no canal.", { reply_markup: backMenu });

    } catch (error) {
        console.error("Erro na verificação",);
        try {
            await ctx.editMessageText("❌ Erro ao verificar informações. Tente novamente.");
        }
        catch {
            console.log("erro")
        }
    }
}
