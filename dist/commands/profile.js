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
exports.default = profile;
const client_1 = require("@prisma/client");
const menus_1 = require("../utils/menus");
const prisma = new client_1.PrismaClient();
function profile(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        ctx.editMessageText("🕰 Acessando informações...");
        const perfil = yield prisma.user.findUnique({
            where: {
                telegramId: ctx.chatId,
            },
        });
        if (perfil) {
            ctx.editMessageText(`👤 Seu perfil:

🆔 \*ID\*: ${perfil.telegramId}
💳 \*Nome\*: ${perfil.firstName}
🔑 \*Access Type\*: ${perfil.access}

\*Data de criação\*: ${perfil.createdAt.toLocaleString()}
            `, { parse_mode: "MarkdownV2", reply_markup: menus_1.profileMenu });
        }
        else {
            const perfil = yield prisma.user.create({
                data: {
                    telegramId: ctx.chatId,
                    firstName: (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.first_name
                },
            });
            ctx.editMessageText(`👤 Seu perfil:

🆔 \*ID\*: ${perfil.telegramId}
💳 \*Nome\*: ${perfil.firstName}
🔑 \*Access Type\*: ${perfil.access}

\*Data de criação\*: ${perfil.createdAt.toLocaleString()}
            `, { parse_mode: "MarkdownV2", reply_markup: menus_1.profileMenu });
        }
    });
}
