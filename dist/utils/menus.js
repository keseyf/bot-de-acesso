"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlAndBackMenu = exports.unrealVipMenu = exports.accessMenu = exports.backMenu = exports.profileMenu = exports.mainMenu = void 0;
const grammy_1 = require("grammy");
const mainMenu = new grammy_1.InlineKeyboard()
    .text("⭐ Acessar conteudo", "access")
    .text("👤 Info ", "profile")
    .row()
    .url("🔧 Suporte ", "t.me/fyex86");
exports.mainMenu = mainMenu;
const profileMenu = new grammy_1.InlineKeyboard()
    .text("⭐ Acessar conteudo", "access")
    .row()
    .text("🔙 Voltar", "start");
exports.profileMenu = profileMenu;
const backMenu = new grammy_1.InlineKeyboard()
    .text("🔙 Voltar", "start");
exports.backMenu = backMenu;
const accessMenu = new grammy_1.InlineKeyboard()
    .text("⭐ Acessar conteudo", "access");
exports.accessMenu = accessMenu;
const unrealVipMenu = (url) => {
    return new grammy_1.InlineKeyboard()
        .url("Entrar", url);
};
exports.unrealVipMenu = unrealVipMenu;
const urlAndBackMenu = (url) => {
    return new grammy_1.InlineKeyboard()
        .text("🔙 Voltar", "start")
        .url("Entrar", url);
};
exports.urlAndBackMenu = urlAndBackMenu;
