import { Resource } from "sst";
import { Telegraf } from "telegraf";
import { API_URL } from "./config";

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

bot.use(
  matchRegex(/^[A-Z]{1,3}\s?\d{1,4}$/i, async (ctx) => {
    const plate = ctx.state.matches.input.toUpperCase();

    const { isSpecialPlate, checksum, description, category, vehicleNo } =
      (await fetch(`${API_URL}/checksum?plate=${plate}`).then((res) =>
        res.json(),
      )) as {
        isSpecialPlate: boolean;
        description: string;
        category: string;
        checksum: string;
        vehicleNo: string;
      };

    let text =
      `🔍 Vehicle Search Results\n\n` +
      `✅ Checksum: ${checksum}\n` +
      `🚗 Vehicle Number: ${vehicleNo}`;

    if (isSpecialPlate) {
      text =
        `🔰 Special Registration Numbers\n\n` +
        `🏢 Category: ${category}\n` +
        `📝 Description: ${description}\n` +
        `⚠️ Note: ${checksum}\n` +
        `🚗 Vehicle Number: ${vehicleNo}`;
    }

    console.log(text);

    const checksumOffset = text.indexOf(checksum);
    const vehicleNumberOffset = text.lastIndexOf(vehicleNo);

    ctx.reply(text, {
      reply_to_message_id: ctx.message.message_id,
      entities: [
        {
          type: "bold",
          offset: checksumOffset,
          length: checksum.length,
        },
        {
          type: "bold",
          offset: vehicleNumberOffset,
          length: vehicleNo.length,
        },
      ],
    });
  }),
);

export const handler = async (event: { body: string }) => {
  const body = JSON.parse(event.body);
  await bot.handleUpdate(body);

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
