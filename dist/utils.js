"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileMenu = exports.mainMenu = void 0;
const grammy_1 = require("grammy");
const mainMenu = new grammy_1.InlineKeyboard()
    .text("😈 Acessar 😈", "vzds")
    .row()
    .text("💸 Realizar Recarga 💸", "recharge")
    .row()
    .text("👤 Info 👤", "profile")
    .row()
    .text("Faq", "faq");
exports.mainMenu = mainMenu;
const profileMenu = new grammy_1.InlineKeyboard()
    .text("💸 Realizar Recarga 💸", "recharge")
    .row()
    .text("🔙 Voltar", "start");
exports.profileMenu = profileMenu;
