import { Bot, Context } from "grammy";
import { mainMenu, unrealVipMenu } from "./utils/menus";
import profile from "./commands/profile";
import { access } from "./commands/access";
import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import spam from "./commands/spam";
import verificarCanal from "./commands/verifyChannel";
import verificarInscricao from "./commands/verifyIncription";
import sendNotInChannelReply from "./commands/notInChannel";
import start from "./commands/start";

const BotToken = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const channelIdFree = process.env.CHANNEL_ID_FREE;
const prisma = new PrismaClient();

if (!BotToken || !channelId || !channelIdFree) {
    throw new Error("Erro: Token do bot ou IDs dos canais não foram definidos corretamente.");
}

const app = new Bot(BotToken);


verificarCanal(channelId, app);
verificarCanal(channelIdFree, app);

setInterval(async () => {
    try {
        await spam(app);
    } catch (error) {
        console.error("Erro no envio automático de mensagens:", error);
    }
}, 45 * 60 * 1000);


app.command("start", async (ctx) => {

    try {
        const isInChannel = await verificarInscricao(ctx, app);
        if (isInChannel === true) {
            start(ctx);
        } else {
            sendNotInChannelReply(ctx, app)
        }
    } catch (error) {
        console.error("Erro ao acessar o perfil:", error);
    }

});

app.callbackQuery("profile", async (ctx) => {
    try {
        const isInChannel = await verificarInscricao(ctx, app);
        if (isInChannel === true) {
            await profile(ctx);
        } else {
            sendNotInChannelReply(ctx, app)
        }
    } catch (error) {
        console.error("Erro ao acessar o perfil:", error);
    }

});

app.callbackQuery("start", async (ctx) => {
    try {
        const isInChannel = await verificarInscricao(ctx, app);
        if (isInChannel === true) {
            await ctx.editMessageText(`👋 Olá, \`${ctx.chat?.first_name}\`, seja bem-vindo!`, {
                reply_markup: mainMenu,
                parse_mode: "Markdown"
            });
        } else {
            sendNotInChannelReply(ctx, app)
        }
    } catch (error) {
        console.error("Erro ao editar mensagem de boas-vindas:", error);
    }
});

app.callbackQuery("access", async (ctx) => {
    try {
        const isInChannel = await verificarInscricao(ctx, app);
        if (isInChannel === true) {
            await access(ctx);
        } else {
            sendNotInChannelReply(ctx, app)
        }
    } catch (error) {
        console.error("Erro ao processar acesso:", error);
    }
});

app.catch((err) => {
    console.error("Erro global capturado:", err);
});

app.start();
