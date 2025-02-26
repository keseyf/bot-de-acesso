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
exports.default = sendNotInChannelReply;
require("dotenv/config");
const menus_1 = require("../utils/menus");
const channelIdFree = process.env.CHANNEL_ID_FREE;
if (!channelIdFree) {
    throw new Error("No channel id provided");
}
function sendNotInChannelReply(ctx, app) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
        const inviteLink = yield app.api.createChatInviteLink(Number(channelIdFree), {
            name: `Convite para ${user}`
        });
        const menu = (0, menus_1.unrealVipMenu)(inviteLink.invite_link);
        yield ctx.reply(`✅ *Agradecemos seu interesse em nosso bot. Para começar a utilizá-lo, é necessário inscrever-se no canal abaixo.

🔰 Inscreva-se agora clicando no botão fornecido abaixo e esteja pronto para aproveitar os serviços do bot. Esta etapa é obrigatória para garantir a segurança e personalização da sua experiência.*`, { reply_markup: menu, parse_mode: "Markdown" });
    });
}
