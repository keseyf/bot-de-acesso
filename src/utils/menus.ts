import { InlineKeyboard } from "grammy"
const mainMenu = new InlineKeyboard()
    .text("⭐ Acessar conteudo", "access")
    .text("👤 Info ", "profile")
    .row()
    .url("🔧 Suporte ", "t.me/fyex86")

const profileMenu = new InlineKeyboard()
    .text("⭐ Acessar conteudo", "access")
    .row()
    .text("🔙 Voltar", "start")

const backMenu = new InlineKeyboard()
    .text("🔙 Voltar", "start")

const accessMenu = new InlineKeyboard()
    .text("⭐ Acessar conteudo", "access")


const unrealVipMenu = (url: string) => {
    return new InlineKeyboard()
        .url("Entrar", url)
}
const urlAndBackMenu = (url: string) => {
    return new InlineKeyboard()
        .text("🔙 Voltar", "start")
        .url("Entrar", url)
}

export { mainMenu, profileMenu, backMenu, accessMenu, unrealVipMenu, urlAndBackMenu }