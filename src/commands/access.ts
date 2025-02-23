import { Context } from "grammy";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import invite from "./invite";
import { Bot } from "grammy";
import { backMenu } from "../utils/menus";
import verification from "./verification";
import register from "./register";
const app = new Bot("7946286603:AAGK48VKGoBhhWe6A8d-jQVREpgm-dsgfhg");

const MPToken = process.env.TOKEN_MP;
const amount = process.env.AMOUNT;

const prisma = new PrismaClient();
if (!MPToken) {
    throw new Error("MercadoPago access token is not defined");
}
if (!amount) {
    throw new Error("Amount is not defined");
}

const mp = new MercadoPagoConfig({
    accessToken: MPToken,
});

const payment = new Payment(mp);

export async function access(ctx: Context) {
    ctx.editMessageText("🕰 Acessando informações...");
    const telegramuserid = ctx.chat?.id;
    const userId = ctx.from?.id?.toString() ?? "0";

    let user = await prisma.user.findUnique({
        where: { telegramId: telegramuserid },
    });

    if (!user) {
        user = await register(ctx);
    }

    if (user?.access === "full") {
        verification(app, ctx);
    } else {
        try {
            const response = await payment.create({
                body: {
                    transaction_amount: Number(amount),
                    payment_method_id: "pix",
                    payer: {
                        email: `user_${userId}@example.com`,
                    },
                },
            });

            if (response?.point_of_interaction?.transaction_data?.qr_code) {
                const pixCopyPasteKey = response.point_of_interaction.transaction_data.qr_code;
                await ctx.editMessageText(
                    `
❌ *Acesso Restrito!*\nPara ter acesso \`FULL\`, efetue o pagamento de *R$${amount}* via Pix. Assim que o pagamento for aprovado, seu acesso será liberado automaticamente.                    

Copie e cole a chave abaixo para efetuar o pagamento. Assim que o pagamento for aprovado, seu acesso será liberado automaticamente.
                    
Chave Pix Copia e Cola: \`${pixCopyPasteKey}\``,
                    { parse_mode: "Markdown", reply_markup: backMenu }
                );
            } else {
                throw new Error("Chave Pix não disponível.");
            }

            const paymentId = response.id;
            if (!paymentId) {
                throw new Error("ID do pagamento não encontrado.");
            }

            // 🔄 Loop para verificar o pagamento a cada 5 segundos
            const checkPayment = async () => {
                for (let i = 0; i < 36; i++) { // 36 tentativas (3 minutos / 5 segundos)
                    try {
                        const paymentStatus = await payment.get({ id: paymentId });

                        if (paymentStatus?.status === "approved") {
                            await prisma.user.update({
                                where: { telegramId: telegramuserid },
                                data: { access: "full" },
                            });
                            await ctx.editMessageText("✅ *Pagamento aprovado!* Seu acesso foi atualizado para FULL.", { parse_mode: "Markdown", reply_markup: backMenu });
                            invite(app, ctx, "🎉⬇ Bem-vindo ao canal! Aqui está o link do canal: ");
                            return; // Sai do loop assim que aprovado
                        }
                    } catch (error) {
                        console.error("Erro ao verificar pagamento:", error);
                    }

                    await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos antes da próxima verificação
                }

                // Se passar 3 minutos sem aprovação, cancela o pagamento
                await ctx.editMessageText("⏳ Tempo expirado! O pagamento não foi concluído dentro do prazo.", { reply_markup: backMenu });
                await payment.cancel({ id: paymentId });
            };

            checkPayment(); // Inicia o loop de verificação

        } catch (error) {
            console.error("Erro ao criar Pix:", error);
            await ctx.editMessageText("❌ Ocorreu um erro ao gerar a chave Pix. Tente novamente mais tarde.");
        }
    }
}
