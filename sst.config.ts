/// <reference path="./.sst/platform/config.d.ts" />

const DOMAIN_NAME = "sgcarplatechecksum.app";

const DOMAIN = {
  dev: { name: `dev.bot.${DOMAIN_NAME}` },
  staging: { name: `staging.bot.${DOMAIN_NAME}` },
  prod: { name: `bot.${DOMAIN_NAME}` },
};

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
        cloudflare: true,
      },
    };
  },
  async run() {
    const TELEGRAM_BOT_TOKEN = new sst.Secret(
      "TelegramBotToken",
      process.env.TELEGRAM_BOT_TOKEN,
    );
    const QSTASH_TOKEN = new sst.Secret(
      "QStashToken",
      process.env.QSTASH_TOKEN,
    );

    new sst.aws.Function("Bot", {
      handler: "src/index.handler",
      link: [TELEGRAM_BOT_TOKEN, QSTASH_TOKEN],
      architecture: "arm64",
      environment: {
        TZ: "Asia/Singapore",
        LOOKUP_API_URL: process.env.LOOKUP_API_URL!,
      },
      url: true,
    });
  },
});
