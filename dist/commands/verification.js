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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verification;
const client_1 = require("@prisma/client");
const invite_1 = __importDefault(require("./invite"));
const menus_1 = require("../utils/menus");
const prisma = new client_1.PrismaClient();
function verification(app, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let dataFinded = false;
            yield ctx.editMessageText("🎲 Verificando Banco de dados...");
            const telegramId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
            if (!telegramId)
                return yield ctx.editMessageText("Erro ao obter ID do usuário. 🤔");
            const user = yield prisma.user.findUnique({
                where: { telegramId },
            });
            if (!user)
                return yield ctx.editMessageText("Usuário não encontrado no banco de dados. 🤔");
            yield ctx.editMessageText("👀 Verificando presença...");
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (!dataFinded) {
                    yield ctx.editMessageText("🕰 Isto pode demorar algum tempo");
                }
            }), 3000);
            const chatMember = yield app.api.getChatMember("-1002339689741", Number(telegramId));
            if (chatMember) {
                dataFinded = true;
            }
            if (["left", "kicked"].includes(chatMember.status)) {
                (0, invite_1.default)(app, ctx, "🤔 Parece que você não está no canal! Eis aqui o link do canal. 😁");
                return;
            }
            yield ctx.editMessageText("✅ Você já está no canal.", { reply_markup: menus_1.backMenu });
        }
        catch (error) {
            console.error("Erro na verificação:", error);
            yield ctx.editMessageText("❌ Erro ao verificar informações. Tente novamente.");
        }
    });
}
