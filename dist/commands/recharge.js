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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePayment = handlePayment;
const mercadopago_1 = __importStar(require("mercadopago"));
const client_1 = require("@prisma/client");
require("dotenv/config");
const MPToken = process.env.TOKEN_MP;
const amount = process.env.AMMOUNT || "0";
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
function handlePayment(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const telegramuserid = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
        const userId = (_d = (_c = (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "0";
        const user = yield prisma.user.findUnique({
            where: { telegramId: telegramuserid },
        });
        if ((user === null || user === void 0 ? void 0 : user.access) === "full") {
            yield ctx.reply("Você já tem acesso FULL.");
        }
        else {
            ctx.reply(`Acesso Restrito! Para ter acesso FULL, efetue o pagamento de ${amount} via Pix. Você terá 3 minutos para concluir o pagamento.`);
            try {
                const response = yield payment.create({
                    body: {
                        transaction_amount: parseInt(amount, 10),
                        payment_method_id: "pix",
                        payer: {
                            email: `user_${userId}@example.com`,
                        },
                    },
                });
                if ((_f = (_e = response === null || response === void 0 ? void 0 : response.point_of_interaction) === null || _e === void 0 ? void 0 : _e.transaction_data) === null || _f === void 0 ? void 0 : _f.qr_code) {
                    const pixCopyPasteKey = response.point_of_interaction.transaction_data.qr_code;
                    yield ctx.reply(`Aqui está a chave Pix para pagamento de R$${amount}. Copie e cole a chave abaixo para efetuar o pagamento. Você tem 3 minutos para concluir o pagamento.\n\nChave Pix Copia e Cola: \`${pixCopyPasteKey}\``, { parse_mode: "Markdown" });
                }
                else {
                    throw new Error("Chave Pix não disponível.");
                }
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const paymentId = response.id;
                        if (!paymentId) {
                            throw new Error("ID do pagamento não encontrado.");
                        }
                        const paymentStatus = yield payment.get({ id: paymentId });
                        if ((paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.status) === "approved") {
                            yield prisma.user.update({
                                where: { telegramId: telegramuserid },
                                data: { access: "full" },
                            });
                            yield ctx.reply("Pagamento aprovado! Seu acesso foi atualizado para FULL.");
                        }
                        else {
                            yield ctx.reply("Pagamento não concluído. Transação cancelada.");
                            yield payment.cancel({ id: paymentId });
                        }
                    }
                    catch (error) {
                        console.error("Erro ao verificar pagamento:", error);
                        yield ctx.reply("Ocorreu um erro ao verificar o pagamento. Tente novamente mais tarde.");
                    }
                }), 2 * 60 * 1000);
            }
            catch (error) {
                console.error("Erro ao criar Pix:", error);
                yield ctx.reply("Ocorreu um erro ao gerar a chave Pix. Tente novamente mais tarde.");
            }
        }
    });
}
