import { Bot, Context } from "grammy";
import { PrismaClient } from "@prisma/client";
import invite from "./invite";
import { backMenu } from "../utils/menus";

const prisma = new PrismaClient();

export default async function verification(app: Bot, ctx: Context) {
    try {
        let dataFinded = false
        ctx.reply("🎲 Verificando Banco de dados...")
        const telegramId = ctx.chat?.id;
        if (!telegramId) return ctx.reply("Erro ao obter ID do usuário. 🤔");

        const user = await prisma.user.findUnique({
            where: { telegramId },
        });

        if (!user) return ctx.reply("Usuário não encontrado no banco de dados. 🤔");
        ctx.reply("👀 Verificando presença...")

        setTimeout(() => {
            if (dataFinded == false) {
                ctx.reply("🕰 Isto pode demorar algum tempo")
            }
        }, 3000)

        const chatMember = await app.api.getChatMember("-1002339689741", Number(telegramId));
        if (chatMember) {
            dataFinded = true
        }
        if (["left", "kicked"].includes(chatMember.status)) {
            invite(app, ctx, "🤔 Parece que você não está no canal! Eis aqui o link do canal. 😁");
            return;
        }
        ctx.reply("✅ Você já está no canal.", { reply_markup: backMenu });

    } catch (error) {
        console.error("Erro na verificação:", error);
        ctx.reply("❌ Erro ao verificar informações. Tente novamente.");
    }
}
