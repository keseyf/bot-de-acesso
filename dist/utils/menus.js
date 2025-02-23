"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backMenu = exports.profileMenu = exports.mainMenu = void 0;
const grammy_1 = require("grammy");
const mainMenu = new grammy_1.InlineKeyboard()
    .text("⭐ Acessar conteudo", "access")
    .row()
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
