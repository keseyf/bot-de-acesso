import { Bot, Context } from "grammy";
import { mainMenu } from "./utils/menus";
import profile from "./commands/profile";
import { access } from "./commands/access";
const app = new Bot("6870648634:AAHkN1XchBXHZ8CT7Qq-QJ-CWaDEBCrIP4E")
import invite from "./commands/invite";

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