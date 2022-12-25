import { BotClient } from '../Core';

export = {
  name: 'ready',
  once: true,
  execute(client: BotClient) {
    client.database.Connection.sync()
      .then(() => console.log('Connected to database.'));
    console.log(`Bot is ready! Logged in as ${client.user!.tag}`);
  },
};
