import { Bot, Context } from "grammy";
import { mainMenu, unrealVipMenu } from "../utils/menus";
import "dotenv/config"

const channelIdFree = process.env.CHANNEL_ID_FREE;
if (!channelIdFree) {
    throw new Error("No channel id provided")
}

export default async function verificarInscricao(ctx: Context, app: Bot) {
    try {
        const user = ctx.chat?.id;
        if (!user) return;

        const chatMember = await app.api.getChatMember(Number(channelIdFree), user);

        if (["left", "kicked"].includes(chatMember.status)) {
            return false
        } else {
            return true
        }
    } catch (error) {
        console.error("Erro ao verificar inscrição:", error);
    }
}
