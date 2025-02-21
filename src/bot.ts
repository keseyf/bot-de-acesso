import { Bot, Context } from "grammy";
import { mainMenu } from "./utils/menus";
import profile from "./commands/profile";
import { access } from "./commands/access";
import 'dotenv/config';
import invite from "./commands/invite";
const BotToken = process.env.BOT_TOKEN

if (!BotToken) {
    throw new Error("MercadoPago access token is not defined");
}

const app = new Bot(BotToken)

try {
    setInterval(async (ctx: Context) => {
        const msg = "Parece que você não está no canal! Eis aqui o link do canal."
        invite(app, ctx, msg)
    }, 12 * 60 * 60 * 1000);
} catch (e) {
    throw new Error("Erro ao enviar convite")
}

app.command("start", (ctx) => {
    ctx.reply(`👋 Olá, \`${ctx.chat?.first_name}\`, Seja Bem vindo!`, { reply_markup: mainMenu, parse_mode: "Markdown" });
})

app.callbackQuery("profile", async (ctx) => {
    await profile(ctx)
})

app.callbackQuery("start", (ctx) => {
    ctx.reply(`👋 Olá, \`${ctx.chat?.first_name}\`, Seja Bem vindo!`, { reply_markup: mainMenu, parse_mode: "Markdown" });
})

app.callbackQuery("access", async (ctx) => {
    await access(ctx)
})

app.start()