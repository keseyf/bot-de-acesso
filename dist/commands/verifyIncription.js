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
exports.default = verificarInscricao;
require("dotenv/config");
const channelIdFree = process.env.CHANNEL_ID_FREE;
if (!channelIdFree) {
    throw new Error("No channel id provided");
}
function verificarInscricao(ctx, app) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const user = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
            if (!user)
                return;
            const chatMember = yield app.api.getChatMember(Number(channelIdFree), user);
            if (["left", "kicked"].includes(chatMember.status)) {
                return false;
            }
            else {
                return true;
            }
        }
        catch (error) {
            console.error("Erro ao verificar inscrição:", error);
        }
    });
}
