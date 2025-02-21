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
exports.default = invite;
const client_1 = require("@prisma/client");
const menus_1 = require("../utils/menus");
const prisma = new client_1.PrismaClient();
function invite(app, ctx, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizedUsers = yield prisma.user.findMany({
                where: {
                    access: "full"
                }
            });
            for (const user of authorizedUsers) {
                if (user.telegramId) {
                    try {
                        const userIsInChannel = yield app.api.getChatMember("-1002339689741", Number(user.telegramId));
                        if (!userIsInChannel || userIsInChannel.status === "left") {
                            const inviteLink = yield app.api.createChatInviteLink("-1002339689741", {
                                name: `Convite para ${user.firstName}`
                            });
                            console.log(`Usuário ${user.telegramId} não está no canal. Enviando link: ${inviteLink.invite_link}`);
                            app.api.sendMessage(String(user.telegramId), `${msg}\n\n${inviteLink.invite_link}`, { reply_markup: menus_1.backMenu });
                            return;
                        }
                    }
                    catch (error) {
                        console.error(`Erro ao verificar/adicionar ${user.telegramId}:`, error);
                    }
                }
            }
        }
        catch (error) {
            console.error("Erro ao buscar usuários no banco de dados:", error);
        }
    });
}
