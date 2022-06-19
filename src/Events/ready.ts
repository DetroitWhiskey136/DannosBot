import { BotClient } from '../Core/index';

export = {
  name: 'ready',
  once: true,
  execute(client: BotClient) {
    client.database.Connection.sync();
    console.log(`Bot is ready! Logged in as ${client.user!.tag}`);
  },
};
