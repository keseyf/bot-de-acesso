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
const app = new grammy_1.Bot("6870648634:AAHkN1XchBXHZ8CT7Qq-QJ-CWaDEBCrIP4E");
const invite_1 = __importDefault(require("./commands/invite"));
try {
    setInterval((ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const msg = "Parece que você não está no canal! Eis aqui o link do canal.";
        (0, invite_1.default)(app, ctx, msg);
    }), 12 * 60 * 60 * 1000);
}
catch (e) {
    throw new Error("Erro ao enviar convite");
}
app.command("start", (ctx) => {
    var _a;
    ctx.reply(`👋 Olá, \`${(_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.first_name}\`, Seja Bem vindo!`, { reply_markup: menus_1.mainMenu, parse_mode: "Markdown" });
});
app.callbackQuery("profile", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, profile_1.default)(ctx);
}));
app.callbackQuery("start", (ctx) => {
    var _a;
    ctx.reply(`👋 Olá, \`${(_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.first_name}\`, Seja Bem vindo!`, { reply_markup: menus_1.mainMenu, parse_mode: "Markdown" });
});
app.callbackQuery("access", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, access_1.access)(ctx);
}));
app.start();
