import { API_URL } from "../../config";

export const lookupHandler = async (ctx) => {
  const vehicleNo: string = ctx.state.matches.input.toUpperCase();

  await ctx.reply(
    `Please wait while we lookup vehicle details for ${vehicleNo}. This might take awhile.`,
  );

  try {
    const response = await fetch(`${API_URL}/lookup/${vehicleNo}`, {
      method: "POST",
    });
    const data = await response.json();
    console.log({ data });

    return ctx.reply(JSON.stringify(data, null, 2), {
      reply_to_message_id: ctx.message.message_id,
    });
  } catch (e) {
    console.error(e.message);
    return ctx.reply(
      `Error occurred while looking up vehicle details for ${vehicleNo}`,
      { reply_to_message_id: ctx.message.message_id },
    );
  }
};
