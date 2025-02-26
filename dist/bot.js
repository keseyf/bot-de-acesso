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
const grammy_1 = require("grammy");
const menus_1 = require("./utils/menus");
const profile_1 = __importDefault(require("./commands/profile"));
const access_1 = require("./commands/access");
require("dotenv/config");
const client_1 = require("@prisma/client");
const spam_1 = __importDefault(require("./commands/spam"));
const verifyChannel_1 = __importDefault(require("./commands/verifyChannel"));
const verifyIncription_1 = __importDefault(require("./commands/verifyIncription"));
const notInChannel_1 = __importDefault(require("./commands/notInChannel"));
const start_1 = __importDefault(require("./commands/start"));
const BotToken = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const channelIdFree = process.env.CHANNEL_ID_FREE;
const prisma = new client_1.PrismaClient();
if (!BotToken || !channelId || !channelIdFree) {
    throw new Error("Erro: Token do bot ou IDs dos canais não foram definidos corretamente.");
}
const app = new grammy_1.Bot(BotToken);
(0, verifyChannel_1.default)(channelId, app);
(0, verifyChannel_1.default)(channelIdFree, app);
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, spam_1.default)(app);
    }
    catch (error) {
        console.error("Erro no envio automático de mensagens:", error);
    }
}), 45 * 60 * 1000);
app.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isInChannel = yield (0, verifyIncription_1.default)(ctx, app);
        if (isInChannel === true) {
            (0, start_1.default)(ctx);
        }
        else {
            (0, notInChannel_1.default)(ctx, app);
        }
    }
    catch (error) {
        console.error("Erro ao acessar o perfil:", error);
    }
}));
app.callbackQuery("profile", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isInChannel = yield (0, verifyIncription_1.default)(ctx, app);
        if (isInChannel === true) {
            yield (0, profile_1.default)(ctx);
        }
        else {
            (0, notInChannel_1.default)(ctx, app);
        }
    }
    catch (error) {
        console.error("Erro ao acessar o perfil:", error);
    }
}));
app.callbackQuery("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isInChannel = yield (0, verifyIncription_1.default)(ctx, app);
        if (isInChannel === true) {
            yield ctx.editMessageText(`👋 Olá, \`${(_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.first_name}\`, seja bem-vindo!`, {
                reply_markup: menus_1.mainMenu,
                parse_mode: "Markdown"
            });
        }
        else {
            (0, notInChannel_1.default)(ctx, app);
        }
    }
    catch (error) {
        console.error("Erro ao editar mensagem de boas-vindas:", error);
    }
}));
app.callbackQuery("access", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isInChannel = yield (0, verifyIncription_1.default)(ctx, app);
        if (isInChannel === true) {
            yield (0, access_1.access)(ctx);
        }
        else {
            (0, notInChannel_1.default)(ctx, app);
        }
    }
    catch (error) {
        console.error("Erro ao processar acesso:", error);
    }
}));
app.catch((err) => {
    console.error("Erro global capturado:", err);
});
app.start();
