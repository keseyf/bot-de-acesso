"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = spam;
const client_1 = require("@prisma/client");
const menus_1 = require("../utils/menus");
const prisma = new client_1.PrismaClient();
const messages = [
    "🔥 Você está preparado para desbloquear conteúdos que vão além da sua imaginação? Entre na Unreal VIP e descubra agora! 😏🚀",
    "😈 O que acontece na Unreal VIP, fica na Unreal VIP... Quer saber o que rola por lá? Só tem um jeito de descobrir! 👀🔞",
    "📵 Conteúdos que você não encontra em qualquer lugar... Só para quem faz parte da Unreal VIP! Vai ficar de fora? 😏🔥",
    "💋 Exclusividade, mistério e muito mais te esperam na Unreal VIP... Mas só para quem tem acesso! Vem conferir! 🔥",
    "🤫 Tem algo quente te esperando... Mas só quem está na Unreal VIP pode ver! Não perca tempo e entre agora! 😏🔥",
    "⚠️ Atenção: esse conteúdo pode ser viciante! 😈 Entre na Unreal VIP e descubra o que só os membros sabem... 🔥",
    "💥 O que você procura, a Unreal VIP tem... Mas só para quem faz parte! Não perca tempo e garanta seu acesso agora! 😏",
    "🔞 Se você gosta de exclusividade, mistério e conteúdos de outro nível... A Unreal VIP é para você! Já garantiu seu acesso? 😉",
    "🔥 Segredos, exclusividade e muito mais te esperam na Unreal VIP! Você está pronto para entrar? 😏🚀",
    "😈 Só os mais curiosos sabem o que acontece na Unreal VIP... E você, vai ficar de fora? 👀🔞",
    "💎 Se exclusividade é o que você procura, a Unreal VIP é o seu lugar! Venha descobrir por que só poucos têm acesso! 😉",
    "💥 O que acontece na Unreal VIP vai mexer com você... Não diga que não avisei! 😏🔥",
    "🕶️ O segredo dos melhores conteúdos está na Unreal VIP! Quer fazer parte desse seleto grupo? Vem! 😈🔥",
    "👀 Você já ouviu falar, mas só quem entra realmente entende... Descubra agora o que tem na Unreal VIP! 💋",
    "⚡ Não adianta procurar em outro lugar... O que você quer só existe na Unreal VIP! Pronto para entrar? 🚀😏",
    "🔐 Mistério, exclusividade e experiências únicas... Tudo isso e muito mais dentro da Unreal VIP! Não perca tempo! 🔥",
    "🔥 Apenas para poucos... A Unreal VIP não é para qualquer um. Será que você está pronto? 😏🚀",
    "💎 O segredo dos melhores está aqui! Só quem faz parte da Unreal VIP entende o que é viver sem limites! 👀",
];
const channelId = process.env.CHANNEL_ID;
if (!channelId) {
    throw new Error("No channel id provided");
}
function spam(app) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield prisma.user.findMany({
                where: {
                    access: "restricted"
                }
            });
            if (users.length === 0) {
                console.log("Nenhum usuário encontrado para envio.");
                return;
            }
            for (const user of users) {
                const rndMsg = messages[Math.floor(Math.random() * messages.length)];
                try {
                    yield app.api.sendMessage(String(user.telegramId), rndMsg, { reply_markup: menus_1.accessMenu });
                    console.log(`Mensagem enviada para ${user.telegramId}`);
                }
                catch (error) {
                    console.error(`Erro ao enviar para ${user.telegramId}:`, error);
                }
            }
        }
        catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    });
}
