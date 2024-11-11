import { Resource } from "sst";
import { Telegraf } from "telegraf";

const bot = new Telegraf(Resource.TelegramBotToken.value);

bot.command("start", (ctx) => ctx.reply("Welcome!"));

const matchRegex = (pattern, handler) => (ctx, next) => {
  const message = ctx.message?.text;
  if (!message) return next();

  const matches = message.match(pattern);
  if (matches) {
    ctx.state.matches = matches;
    return handler(ctx, next);
  }
  return next();
};

bot.use(
  matchRegex(/^[A-Z]{1,3}\s?\d{1,4}$/, async (ctx) => {
    const plate = ctx.state.matches[0];

    const result: any = await fetch(
      `https://sg-carplate-checksum-dev-honoscript.ruchernchong.workers.dev/checksum?plate=${plate}`,
    ).then((res) => res.json());

    const licensePlate = plate + result.checksum;
    const reply = `Checksum: ${result.checksum}\n\nLicense Plate: ${licensePlate}`;

    return ctx.reply(reply, { reply_to_message_id: ctx.message.message_id });
  }),
);

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  await bot.handleUpdate(body);

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
