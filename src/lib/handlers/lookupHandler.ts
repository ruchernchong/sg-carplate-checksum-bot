import { Resource } from "sst";
import { Client } from "@upstash/qstash";
import { LOOKUP_API_URL } from "@/config";

const qstash = new Client({ token: Resource.QStashToken.value });

export const lookupHandler = async (ctx) => {
  const chatId = ctx.update.message.chat.id;
  const vehicleNo: string = ctx.state.matches.input.toUpperCase();

  const hours = new Date().getHours();
  if (hours >= 0 && hours < 6) {
    return ctx.reply("Service unavailable between 12 AM and 6 AM SGT.");
  }

  const params = new URLSearchParams();
  params.set("chatId", chatId);
  params.set("vehicleNo", vehicleNo);

  console.log(`${LOOKUP_API_URL}/lookup`);

  await qstash
    .publishJSON({
      url: `${LOOKUP_API_URL}/lookup`,
      body: { chatId, vehicleNo },
    })
    .catch((e) => {
      console.error("Error queuing job:", e);
    });

  const response =
    "📊 Processing Request\n" +
    "⏳ Duration: 1-2 minutes\n" +
    "📱 You'll be notified when ready";

  return ctx.reply(response, {
    reply_to_message_id: ctx.message.message_id,
  });
};
