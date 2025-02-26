import { Bot } from "grammy";

export default async function verificarCanal(channel: string, app: Bot) {
    try {
        const chatInfo = await app.api.getChat(channel);
        console.log(`✅ Bot conectado ao canal: ${chatInfo.title}`);
        return true;
    } catch (error) {
        console.error(`❌ Erro ao acessar o canal ${channel}:`, error);
        return false;
    }
}