import { API_URL } from "../../config";
import { ChecksumResponse } from "../../types/checksum";

export const checksumHandler = async (ctx) => {
  const plate = ctx.state.matches.input.toUpperCase();

  const response = await fetch(`${API_URL}/checksum?plate=${plate}`);
  const data = (await response.json()) as ChecksumResponse;

  const { isSpecialPlate, checksum, description, category, vehicleNo } = data;

  let text = [
    "🔍 Vehicle Search Results\n",
    `✅ Checksum: ${checksum}`,
    `🚗 Vehicle Number: ${vehicleNo}`,
  ].join("\n");

  if (isSpecialPlate) {
    text = [
      "🔰 Special Registration Numbers\n",
      `🏢 Category: ${category}`,
      `📝 Description: ${description}`,
      `⚠️ Note: ${checksum}`,
      `🚗 Vehicle Number: ${vehicleNo}`,
    ].join("\n");
  }

  console.log(text);

  const checksumOffset = text.indexOf(checksum);
  const vehicleNumberOffset = text.lastIndexOf(vehicleNo);

  return ctx.reply(text, {
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
};
