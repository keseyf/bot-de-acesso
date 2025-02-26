"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.access = access;
const mercadopago_1 = __importStar(require("mercadopago"));
const client_1 = require("@prisma/client");
require("dotenv/config");
const invite_1 = __importDefault(require("./invite"));
const menus_1 = require("../utils/menus");
const verification_1 = __importDefault(require("./verification"));
const register_1 = __importDefault(require("./register"));
const MPToken = process.env.TOKEN_MP;
const amount = process.env.AMOUNT;
const prisma = new client_1.PrismaClient();
if (!MPToken) {
    throw new Error("MercadoPago access token is not defined");
}
if (!amount) {
    throw new Error("Amount is not defined");
}
const mp = new mercadopago_1.default({
    accessToken: MPToken,
});
const payment = new mercadopago_1.Payment(mp);
function access(ctx, app) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        ctx.editMessageText("🕰 Acessando informações...");
        const telegramuserid = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
        const userId = (_d = (_c = (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "0";
        let user = yield prisma.user.findUnique({
            where: { telegramId: telegramuserid },
        });
        if (!user) {
            user = yield (0, register_1.default)(ctx);
        }
        if ((user === null || user === void 0 ? void 0 : user.access) === "full") {
            (0, verification_1.default)(app, ctx);
        }
        else {
            try {
                const response = yield payment.create({
                    body: {
                        transaction_amount: Number(amount),
                        payment_method_id: "pix",
                        payer: {
                            email: `user_${userId}@example.com`,
                        },
                    },
                });
                if ((_f = (_e = response === null || response === void 0 ? void 0 : response.point_of_interaction) === null || _e === void 0 ? void 0 : _e.transaction_data) === null || _f === void 0 ? void 0 : _f.qr_code) {
                    const pixCopyPasteKey = response.point_of_interaction.transaction_data.qr_code;
                    yield ctx.editMessageText(`
❌ *Acesso Restrito!*\nPara ter acesso \`FULL\`, efetue o pagamento de *R$${amount}* via Pix. Assim que o pagamento for aprovado, seu acesso será liberado automaticamente.                    

Copie e cole a chave abaixo para efetuar o pagamento. Assim que o pagamento for aprovado, seu acesso será liberado automaticamente.
                    
Chave Pix Copia e Cola: \`${pixCopyPasteKey}\``, { parse_mode: "Markdown", reply_markup: menus_1.backMenu });
                }
                else {
                    throw new Error("Chave Pix não disponível.");
                }
                const paymentId = response.id;
                if (!paymentId) {
                    throw new Error("ID do pagamento não encontrado.");
                }
                // 🔄 Loop para verificar o pagamento a cada 5 segundos
                const checkPayment = () => __awaiter(this, void 0, void 0, function* () {
                    for (let i = 0; i < 36; i++) { // 36 tentativas (3 minutos / 5 segundos)
                        try {
                            const paymentStatus = yield payment.get({ id: paymentId });
                            if ((paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.status) === "approved") {
                                yield prisma.user.update({
                                    where: { telegramId: telegramuserid },
                                    data: { access: "full" },
                                });
                                yield ctx.editMessageText("✅ *Pagamento aprovado!* Seu acesso foi atualizado para FULL.", { parse_mode: "Markdown", reply_markup: menus_1.backMenu });
                                (0, invite_1.default)(app, ctx, "🎉⬇ Bem-vindo ao canal! Aqui está o link do canal: ");
                                return; // Sai do loop assim que aprovado
                            }
                        }
                        catch (error) {
                            console.error("Erro ao verificar pagamento:", error);
                        }
                        yield new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos antes da próxima verificação
                    }
                    // Se passar 3 minutos sem aprovação, cancela o pagamento
                    yield ctx.editMessageText("⏳ Tempo expirado! O pagamento não foi concluído dentro do prazo.", { reply_markup: menus_1.backMenu });
                    yield payment.cancel({ id: paymentId });
                });
                checkPayment(); // Inicia o loop de verificação
            }
            catch (error) {
                console.error("Erro ao criar Pix:", error);
                yield ctx.editMessageText("❌ Ocorreu um erro ao gerar a chave Pix. Tente novamente mais tarde.");
            }
        }
    });
}
