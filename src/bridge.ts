import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { agent } from "./agent";
import { Message } from "telegraf/typings/core/types/typegram";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.on("message", async (ctx) => {
  const message = ctx.message as Message.TextMessage;

  if (!message.text) {
    await ctx.reply("❌ Please send a text command.");
    return;
  }

  const res = await agent.respond(message.text);
  const reply = res.text || "No response.";
  await ctx.reply(reply);
});

bot.launch();
