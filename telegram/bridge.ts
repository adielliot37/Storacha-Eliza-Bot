import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import fetch from "node-fetch";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.on("message", async (ctx) => {
  const message = ctx.message;
  const user = ctx.from.username || "user";

  const form = new FormData();

  try {
 
    if ("text" in message) {
      form.append("text", message.text);
      form.append("user", user);
    }

 
    if ("document" in message && message.document) {
      form.append("text", "upload this");
      form.append("user", user);

      const fileId = message.document.file_id;
      const fileName = message.document.file_name || "file.bin";

      const fileUrl = await getTelegramFileUrl(fileId);
      const buffer = await (await fetch(fileUrl)).buffer();
      form.append("file", buffer, fileName);
    }

  
    if ("photo" in message && message.photo) {
      form.append("text", "upload this");
      form.append("user", user);

      const highestResPhoto = message.photo[message.photo.length - 1];
      const fileId = highestResPhoto.file_id;

      const fileUrl = await getTelegramFileUrl(fileId);
      const buffer = await (await fetch(fileUrl)).buffer();
      form.append("file", buffer, "photo.jpg");
    }

    const res = await axios.post(
      "http://164.52.202.62:3000/b850bc30-45f8-0041-a00a-83df46d8555d/message",
      form,
      { headers: form.getHeaders() }
    );

    const messages = res.data;
    if (Array.isArray(messages)) {
      for (const msg of messages) {
        if (msg.text) {
          await ctx.reply(msg.text);
        }
      }
    } else {
      await ctx.reply("🤖 Unexpected agent response.");
    }
    
  } catch (err) {
    console.error("Upload error:", err);
    await ctx.reply("⚠️ Upload failed or agent error.");
  }
});

bot.launch();


async function getTelegramFileUrl(fileId: string): Promise<string> {
  const res = await axios.get(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
  );
  const path = res.data.result.file_path;
  return `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${path}`;
}
