import { Context } from "grammy";
import { mainMenu } from "../utils/menus";

export default function start(ctx: Context) {
    ctx.reply(`👋 Olá, \`${ctx.chat?.first_name}\`, seja bem-vindo!`, {
        reply_markup: mainMenu,
        parse_mode: "Markdown"
    });
}