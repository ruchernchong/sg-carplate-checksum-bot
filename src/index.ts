import { Resource } from "sst";
import { Telegraf } from "telegraf";
import { checksumHandler } from "./lib/handlers/checksumHandler";

const bot = new Telegraf(Resource.TelegramBotToken.value);

bot.command("start", (ctx) => ctx.reply("Welcome!"));

const matchRegex = (pattern: RegExp, handler) => (ctx, next) => {
  const message = ctx.message?.text;
  if (!message) return next();

  const matches = message.match(pattern);
  if (matches) {
    ctx.state.matches = matches;
    return handler(ctx, next);
  }
  return next();
};

bot.use(matchRegex(/^[A-Z]{1,3}\s?\d{1,4}$/i, checksumHandler));

export const handler = async (event: { body: string }) => {
  const body = JSON.parse(event.body);
  await bot.handleUpdate(body);

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
