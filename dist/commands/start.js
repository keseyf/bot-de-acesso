"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = start;
const menus_1 = require("../utils/menus");
function start(ctx) {
    var _a;
    ctx.reply(`👋 Olá, \`${(_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.first_name}\`, seja bem-vindo!`, {
        reply_markup: menus_1.mainMenu,
        parse_mode: "Markdown"
    });
}
