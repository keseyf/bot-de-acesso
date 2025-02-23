import { InlineKeyboard } from "grammy"
const mainMenu = new InlineKeyboard()
    .text("⭐ Acessar conteudo", "access")
    .row()
    .text("👤 Info ", "profile")
    .row()
    .url("🔧 Suporte ", "t.me/fyex86")

const profileMenu = new InlineKeyboard()
    .text("⭐ Acessar conteudo", "access")
    .row()
    .text("🔙 Voltar", "start")

const backMenu = new InlineKeyboard()
    .text("🔙 Voltar", "start")

export { mainMenu, profileMenu, backMenu }