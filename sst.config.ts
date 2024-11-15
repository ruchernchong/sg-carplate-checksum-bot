/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sg-carplate-checksum-bot",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "ap-southeast-1",
        },
      },
    };
  },
  async run() {
    const TELEGRAM_BOT_TOKEN = new sst.Secret(
      "TelegramBotToken",
      process.env.TELEGRAM_BOT_TOKEN,
    );

    new sst.aws.Function("Bot", {
      handler: "src/index.handler",
      link: [TELEGRAM_BOT_TOKEN],
      architecture: "arm64",

      url: true,
    });
  },
});
