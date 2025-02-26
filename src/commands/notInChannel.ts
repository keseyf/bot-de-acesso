import { Bot, Context } from "grammy";
import "dotenv/config"
import { unrealVipMenu } from "../utils/menus";

const channelIdFree = process.env.CHANNEL_ID_FREE;

if (!channelIdFree) {
    throw new Error("No channel id provided")
}

export default async function sendNotInChannelReply(ctx: Context, app: Bot) {
    const user = ctx.chat?.id
    const inviteLink = await app.api.createChatInviteLink(Number(channelIdFree), {
        name: `Convite para ${user}`
    });

    const menu = unrealVipMenu(inviteLink.invite_link);

    await ctx.reply(`✅ *Agradecemos seu interesse em nosso bot. Para começar a utilizá-lo, é necessário inscrever-se no canal abaixo.

🔰 Inscreva-se agora clicando no botão fornecido abaixo e esteja pronto para aproveitar os serviços do bot. Esta etapa é obrigatória para garantir a segurança e personalização da sua experiência.*`, { reply_markup: menu, parse_mode: "Markdown" });
}